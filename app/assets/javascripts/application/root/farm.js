$(function () {

  /**
   * Farm's "page_content" attribute description :
   * [{
   *   "type": 'text' | 'map',
   *   "data": <text>, // if type == text
   *   "data": null,   // if type == map
   * }, ...]
   */
  
  var root = $('body.farm');
  if (root.length == 0)
    return ;

  var isOwner = root.is('.is-owner');

  //
  // Header

  var Header = function () {
    this.$el = $('.banner');
    this.$el.on('click', '.remove-banner.banner-btn', _.bind(this.submitForm, this));
    this.$el.on('change', 'input[type=file]', _.bind(this.submitForm, this));
  };

  Header.prototype.submitForm = function () {
    this.$el.find('form').submit();
    return false;
  };

  //
  // Rows

  var Rows = function (options) {
    this.$el = $('#farm-rows');
    this.$ownerUi = null;
    this.isEditing = false;

    this.farm = _.get(options, 'farm');
    this.saveManager = _.get(options, 'saveManager');

    this.types = {};
  };

  Rows.ownerUiTemplate = _.template(''
    +'<div class="owner-ui">'
      +'<button class="rbutton" data-toggle="add-row-menu">'
        +'<i class="fi-plus"></i> Ajouter un bloc'
      +'</button>'
      +'<button class="rbutton" data-toggle="edit-row-menu">'
        +'<i class="fi-page-edit"></i> Modifier'
      +'</button>'
      +'<button class="rbutton" id="preview-row-btn">'
        +'<i class="fi-eye"></i> Prévisualiser'
      +'</button>'
      +'<div id="add-row-menu" class="dropdown-pane" data-dropdown data-close-on-click="true">'
        +'<ul class="vertical menu align-left">'
          +'<% for (var id in types) { %>'
           +'<li><a class="${id}">${types[id].name}</a></li>'
          +'<% } %>'
        +'</ul>'
      +'</div>'
      +'<div id="edit-row-menu" class="dropdown-pane" data-dropdown data-close-on-click="true" data-dropdown-position="bottom">'
        +'<ul class="vertical menu align-left">'
          +'<li><a class="edit"><i class="fi-page-edit"></i> Modifier</a></li>'
          +'<li><a class="remove"><i class="fi-minus"></i> Supprimer</a></li>'
          +'<li><a class="ascend"><i class="fi-arrow-up"></i> Monter</a></li>'
          +'<li><a class="descend"><i class="fi-arrow-down"></i> Descendre</a></li>'
        +'</ul>'
      +'</div>'
    +'</div>'
  );

  Rows.prototype.registerType = function (typeObj) {
    if (_.isString(typeObj.id)
        && _.isFunction(typeObj.defaultData)
        && _.isFunction(typeObj.makeFunc)
        && _.isFunction(typeObj.editFunc)
        && _.isFunction(typeObj.prevFunc)
        && _.isFunction(typeObj.saveFunc))
      this.types[typeObj.id] = typeObj;
  };

  Rows.prototype.render = function () {
    var that = this;

    if (isOwner) {
      $(document).on('mouseenter', '.farm-row', function () {
        that.showOwnerUi($(this));
      });
      $(document).on('mouseleave', '.farm-row', function () {
        that.hideOwnerUi();
      });
      $(document).on('click', '#add-row-menu a', function () {
        that._onAddRowBtnClick($(this));
      });
      $(document).on('click', '#edit-row-menu a', function () {
        that._onEditRowBtnClick($(this));
      });
      $(document).on('click', '#preview-row-btn', function () {
        that._onPreviewRowBtnClick($(this));
      });
    }
    this.farm.page_content.forEach(function (row, i) {
      this.insertRow(row, i);
    }, this);
  };

  Rows.prototype.save = function () {
    var that = this;
    var data = [];

    this.getRows().each(function () {
      var $row = $(this);
      var typeObj = that.types[$row.data('typeId')];

      if (typeObj)
        data.push({type: typeObj.id, data: typeObj.saveFunc($row)});
    });
    return data;
  };

  Rows.prototype.showOwnerUi = function ($row) {
    if (this.$ownerUi) return ;
    this.$ownerUi = $(Rows.ownerUiTemplate({types: this.types}));
    this.$ownerUi.appendTo($row);
    this.$ownerUi.find('.dropdown-pane').foundation();
    this.$ownerUi.show();
    this.$ownerUi.parent().css('outline', '4px solid red');
    this.renderOwnerUi();
  };

  Rows.prototype.renderOwnerUi = function () {
    if (!this.$ownerUi) return ;
    var $row = this.$ownerUi.parent();

    this.$ownerUi.css(_.merge($row.offset(), {
      width: $row.width()
        + parseInt($row.css('padding-left'))
        + parseInt($row.css('padding-right')),
    }));
    this.$ownerUi.find('#preview-row-btn')[this.isEditing ? 'show' : 'hide']();
  };

  Rows.prototype.hideOwnerUi = function () {
    if (!this.$ownerUi) return ;
    if (this.isEditing) return ;
    this.$ownerUi.parent().css('outline', 'none');
    this.$ownerUi.remove();
    this.$ownerUi = null;
  };

  Rows.prototype.insertRow = function (row, i) {
    var typeObj = this.types[row.type];

    if (typeObj) {
      var $rows = this.getRows();
      var data  =_.get(row, 'data', typeObj.defaultData(this.farm));
      var $row  = typeObj.makeFunc.call(typeObj, this.farm, data)
        .data('typeId', typeObj.id);
  
      if (i == 0)
        this.$el.prepend($row);
      else
        $row.insertAfter($rows[i - 1]);
    }
  };

  Rows.prototype.getRows = function () {
    return this.$el.find('.farm-row');
  };

  Rows.prototype._onAddRowBtnClick = function ($btn) {
    var typeObj = this.types[$btn.attr('class')];
    var $row    = $btn.parents('.farm-row');
   
    this.insertRow({type: typeObj.id, data: typeObj.defaultData(this.farm)},
      this.getRows().index($row) + 1);
    this.saveManager.setChanged(true);
    this.renderOwnerUi($row);
  };

  Rows.prototype._onEditRowBtnClick = function ($btn) {
    var action = $btn.attr('class');
    var method = '_on' + _.upperFirst(action) + 'RowAction';
    var $row   = $btn.parents('.farm-row');

    if (_.isFunction(this[method]))
      this[method]($row);
  };

  Rows.prototype._onPreviewRowBtnClick = function ($btn) {
    if (!this.isEditing) return ;
    var $row    = $btn.parents('.farm-row');
    var typeObj = this.types[$row.data('typeId')];

    if (typeObj) {
      typeObj.prevFunc.call(typeObj, $row);
      $row.find('.content').toggle();
      $row.find('.content-edit').toggle();
      this.isEditing = false;
      this.renderOwnerUi();
    }
  };

  Rows.prototype._onEditRowAction = function ($row) {
    if (this.isEditing) return ;
    var typeObj = this.types[$row.data('typeId')];

    if (typeObj && typeObj.editFunc.call(typeObj, $row)) {
      $row.find('.content').toggle();
      $row.find('.content-edit').toggle();
      this.isEditing = true;
      this.saveManager.setChanged(true);
      this.renderOwnerUi();
    }
  };

  Rows.prototype._onRemoveRowAction = function ($row) {
    $row.remove();
    this.saveManager.setChanged(true);
    this.renderOwnerUi();
  };

  Rows.prototype._onAscendRowAction = function ($row) {
    var $rows = this.getRows();
    var i     = $rows.index($row);

    if (i > 0) {
      $row.insertBefore($rows[i - 1]);
      this.saveManager.setChanged(true);
      this.renderOwnerUi();
    }
  };

  Rows.prototype._onDescendRowAction = function ($row) {
    var $rows = this.getRows();
    var i     = $rows.index($row);

    if (i < $rows.length - 1) {
      $row.insertAfter($rows[i + 1]);
      this.saveManager.setChanged(true);
      this.renderOwnerUi();
    }
  };

  Rows.TextRow = {
    id: 'text',
    name: '<i class="fi-pencil"></i> Texte',
    defaultData: function (farm) {
      return {text: '<h1>Titre</h1><p>Votre texte ici ...</p>'};
    },
    template: _.template(''
      +'<div class="text farm-row">'
        +'<div class="content">'
          +'<div class="ql-editor">${rowData.text}</div>'
        +'</div>'
        +'<div class="content-edit">'
          +'<div>${rowData.text}</div>'
        +'</div>'
      +'</div>'
    ),
    makeFunc: function (farm, rowData) {
      var $row;
      
      $row = $(this.template({farm: farm, rowData: rowData}));
      $row.data('data', rowData);
      return $row;
    },
    editFunc: function ($row) {
      if (!$row.data('quill'))
        $row.data('quill', Helpers.newQuill($row.find('.content-edit div').get(0)));
      return true;
    },
    prevFunc: function ($row) {
      var quill = $row.data('quill');
      var html  = quill.root.innerHTML;

      $row.data('data', {text: html});
      $row.find('.content .ql-editor').html(html);
    },
    saveFunc: function ($row) {
      return $row.data('data');
    },
  };

  Rows.MapRow = {
    id: 'map',
    name: '<i class="fi-marker"></i> Carte',
    defaultData: function (farm) {
      return {text: _.template(''
        +'<h1 class="ql-align-center">Où ?</h1>'
        +'<p class="ql-align-justify">Mettre ici les indications routières pour accéder à votre ferme.</p><p><br/></p>'
      )()}
    },
    template: _.template(''
      +'<div class="map expanded farm-row">'
        +'<div class="content">'
          +'<div class="infos">'
            +'<div class="ql-editor">${rowData.text}</div>'
            +'<i class="fi-marker"></i>'
            +'<div class="addr">'
              +'${_.replace(farm.address, /, /g, "<br/>")}<br/>'
              +'<u>Lat</u> : ${farm.lat}<br/>'
              +'<u>Lon</u> : ${farm.lng}'
            +'</div>'
          +'</div>'
          +'<iframe src="https://www.google.com/maps/embed/v1/place?q=${farm.lat},${farm.lng}&key=AIzaSyB5V1m3yWciaNyGX6XqDc2cVoN9nYujzaI&language=fr" allowfullscreen></iframe>'
        +'</div>'
        +'<div class="content-edit">'
          +'<div>${rowData.text}</div>'
        +'</div>'
      +'</div>'
    ),
    makeFunc: function (farm, rowData) {
      var $row;

      $row = $(this.template({farm: farm, rowData: rowData}));
      $row.data('data', rowData);
      this._resizeMap($row);
      return $row;
    },
    editFunc: function ($row) {
      if (!$row.data('quill'))
        $row.data('quill', Helpers.newQuill($row.find('.content-edit div').get(0)));
      return true;
    },
    prevFunc: function ($row) {
      var quill = $row.data('quill');
      var html  = quill.root.innerHTML;

      $row.data('data', {text: html});
      $row.find('.content .ql-editor').html(html);
      this._resizeMap($row);
    },
    saveFunc: function ($row) {
      return $row.data('data');
    },
    _resizeMap: function ($row) {
      var $infos = $row.find('.infos');

      _.defer(function () {
        var isAbsolute = ($infos.css('position') == 'absolute');

        $row.find('iframe').css(
          'height', $infos.height()
            + (isAbsolute ? $infos.position().top * 2 : 0)
            + parseInt($infos.css('padding-top')) * 2
            + 'px'
        );
      });
    },
  };

  Rows.ContactRow = {
    id: 'contact',
    name: '<i class="fi-mail"></i> Contact',
    defaultData: function (farm) {
      return {text: _.template(''
        +'<h1 class="ql-align-center">Nous contacter</h1>'
        +'<p class="ql-align-justify">Pour nous contacter, vous pouvez utiliser le formulaire ci-dessous,'
        +' nous vous répondrons au plus vite. Vous pouvez aussi passer par'
        +' <a href=\"tel:${farm.phone}\">téléphone au (${farm.phone})</a>.</p><p><br/></p>'
      )()}
    },
    template: _.template(''
      +'<div class="contact farm-row">'
        +'<div class="content">'
          +'<div class="ql-editor">${rowData.text}</div>'
          +'<form action="${window.location.pathname}/sendmail" accept-charset="UTF-8" method="post">'
            +'<div>'
              +'<label for="contact_name">Prénom NOM</label>'
              +'<input id="contact_name" name="contact[name]" type="text" required/>'
            +'</div>'
            +'<div>'
              +'<label for="contact_email">Adresse électronique</label>'
              +'<input id="contact_email" name="contact[email]" type="text" required/>'
            +'</div>'
            +'<div>'
              +'<label for="contact_subject">Sujet</label>'
              +'<input id="contact_subject" name="contact[subject]" type="text"/>'
            +'</div>'
            +'<div>'
              +'<label for="contact_msg">Message</label>'
              +'<textarea id="contact_msg" name="contact[msg]" rows="7" required></textarea>'
            +'</div>'
            +'<div class="actions">'
              +'<button type="submit" class="button">'
              +'<i class="fi-mail"></i> Envoyer</button>'
            +'</div>'
          +'</form>'
        +'</div>'
        +'<div class="content-edit">'
          +'<div>${rowData.text}</div>'
        +'</div>'
      +'</div>'
    ),
    makeFunc: function (farm, rowData) {
      var $row;
      
      $row = $(this.template({farm: farm, rowData: rowData}));
      $row.data('data', rowData);
      return $row;
    },
    editFunc: function ($row) {
      if (!$row.data('quill'))
        $row.data('quill', Helpers.newQuill($row.find('.content-edit div').get(0)));
      return true;
    },
    prevFunc: function ($row) {
      var quill = $row.data('quill');
      var html  = quill.root.innerHTML;

      $row.data('data', {text: html});
      $row.find('.content .ql-editor').html(html);
    },
    saveFunc: function ($row) {
      return $row.data('data');
    },
  };

  Rows.ImageRow = {
    id: 'image',
    name: '<i class="fi-photo"></i> Image',
    defaultData: _.noop,
    template: _.template(''
      +'<div class="image expanded farm-row">'
        +'<div class="content"></div>'
        +'<div class="content-edit">'
          +'<label for="image_row_input">Changer l\'image...</label>'
          +'<input type="file" id="image_row_input"/>'
        +'</div>'
      +'</div>'
    ),
    makeFunc: function (farm, rowData) {
      var $row;

      $row = $(this.template({farm: farm, rowData: rowData}));
      $row.data('data', rowData);
      if (rowData.dataUrl)
        $row.find('.content, .content-edit').css('background-image', 'url(' + rowData.dataUrl + ')');
      $row.find('input').on('change', function () {
        var file   = this.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
          $row.data('data', {dataUrl: reader.result});
          $row.find('.content, .content-edit').css('background-image', 'url(' + reader.result + ')');
        }, false);

        if (file)
          reader.readAsDataURL(file);
      });
      return $row;
    },
    editFunc: function ($row) {
      return true;
    },
    prevFunc: _.noop,
    saveFunc: function ($row) {
      return $row.data('data');
    },
  };

  //
  // SaveManager

  var SaveManager = function () {
    this.hasChanged = false;
    this.onBeforeSaveListener = null;
    this.$form = $('#page-content-form');
    this.$form.find('button').on('click', _.bind(this.save, this));
  };

  SaveManager.prototype.save = function () {
    if (_.isFunction(this.onBeforeSaveListener))
      this.onBeforeSaveListener.call(this);
    this.setChanged(false);
    this.$form.submit();
  };

  SaveManager.prototype.setChanged = function (hasChanged) {
    this.hasChanged = hasChanged;
    window.onbeforeunload = (hasChanged) ? function () { return true; } : null;
  };

  SaveManager.prototype.setPageContent = function (pc) {
    this.$form.find('#farm_page_content').val(JSON.stringify(pc));
  };

  SaveManager.prototype.setOnBeforeSaveListener = function (listener) {
    this.onBeforeSaveListener = listener;
  };

  //
  // Main

  var save = new SaveManager();
  var header = new Header();
  var rows = new Rows({farm: window.farm, saveManager: save});

  rows.registerType(Rows.ContactRow);
  rows.registerType(Rows.ImageRow);
  rows.registerType(Rows.MapRow);
  rows.registerType(Rows.TextRow);
  rows.render();

  save.setOnBeforeSaveListener(function () {
    this.setPageContent(rows.save());
  });

});
