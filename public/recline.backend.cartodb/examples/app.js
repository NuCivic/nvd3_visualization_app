;(function($) {
  'use strict';

  $(document).on('ready', function(){

    var remoteDataset = new recline.Model.Dataset({
      backend: 'cartodb',
      user: 'dkan-admin',
      table: 'madison_trees',
    });
    remoteDataset
    .fetch()
    .done(function(data){
      console.log(data);
    });

  });
})(jQuery);
