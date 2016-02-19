 //模拟server回应ajax请求
    $.mockjax({
            url: 'getMockData',
            status: 200,
            responseTime: 750,
            response: function(ajaxData) {
                console.log(ajaxData);  
                this.responseText = {volume: ajaxData.data.volume, offset: ajaxData.data.offset, list: list.slice(ajaxData.offset, ajaxData.volume)};
            }
    });
    // 页面数据
    var list = [];
    for(var i = 0; i < 100; i++){
      list.push(i);
    }
    // 页面导航时的处理函数
     function refreshPage(page){
           $.ajax({
         url: 'getMockData',
         data: {
               offset: pnav.getPageSize() * (page - 1),
               volume: pnav.getPageSize()
         },
         type: 'POST',
         success: function(data){
            pnav.refreshNav(data);
            $('#content').empty();
            var arr = data.list.slice(data.offset, data.offset + parseInt(data.volume));
            arr.forEach(function(e){
                $('<li>' + e + '</li>').appendTo($('#content'));
            });
         }
       })
     }
    //实例化一个pnav对象
    var pnav = new PageNav(_.template($('#pageTpl').html()),
							         $('#container'),
							         refreshPage,
									{totalCount: list.length, volume: 10}
					      );
    refreshPage(1);
    
     