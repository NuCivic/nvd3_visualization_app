
  'use strict';

  $(document).on('ready', function(){
  	var state = new recline.Model.ObjectState();
    var sharedObject = {state: state};

  	var msv = new MultiStageView({
  		state: state,
  		el: $('#steps')
  	});

    msv.on('multistep:change', function(e){
     $("#example").hide(); 
    });

    window.router = new recline.URLState();
    msv.addStep(new LoadDataView(sharedObject));
    msv.addStep(new DataOptionsView(sharedObject));
    msv.addStep(new ChooseChartView(sharedObject));
    msv.addStep(new ChartOptionsView(sharedObject));
  	msv.addStep(new PublishView(sharedObject));
  	msv.render();

    // only useful in devel
    window.msv = msv;
    window.sharedObject = sharedObject;

    _addEventListeners();
})(window);

function _addEventListeners () {
  console.log('Add events');
  $('.example-data').click(function (e) {
    console.log('c',e);
    $('#control-chart-source').val($(e.target).text());
    $('#control-chart-backend').val($(e.target).data('type'));
  });
}
