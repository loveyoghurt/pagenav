/**
 * Created by xc on 2016-2-2.
 */
/**
 * @param pnavTpl 页码的模板
 * @param pnavContainer 放页码的容器
 * @param loadPageFun 导航时触发的回调
 * @param data 页码数据，包含：volume每页显示条数  totalCount总内容条数
 **/
var PageNav = function (pnavTpl, pnavContainer, loadPageFun, data) {
    this.pnavTpl = pnavTpl;
    this.pnavContainer = pnavContainer;
    this.loadPageFun = loadPageFun;
    this.params = {};
    this.lastPageSize = 0;//保存当前每页条数，以便点选页数select后取得变化前的值
    this.curPage = 1;
    this.totalCount = parseInt(data['totalCount']);
    this.volume = parseInt(data['volume']);
    this.totalPage = Math.ceil(data.totalCount / data.volume);
    //数据填进模板
    var html = this.pnavTpl({
        page: this.curPage,
        totalPage: this.totalPage,
        totalCount: data.totalCount,
        volume: data.volume
    });
    this.pnavContainer.html(html);
    var self = this;
    var getPageSize = function () {
        return parseInt(self.pnavContainer.find(".limit option:selected").val() || self.volume);
    };
    this.lastPageSize = getPageSize();
    // 导航行为
    this.bind = function () {
        self.pnavContainer.delegate('li a', 'click', function () {
            var ele = $(this);
            var role = ele.data('role');
            $(this).parent('li').removeClass('active');
            if (role == 'prev') {
                if (self.curPage == 1) {
                    return;
                } else {
                    self.gotoPage(self.curPage - 1);
                }
            } else if (role == 'next') {
                if (self.curPage == self.totalPage) {
                    return;
                } else {
                    self.gotoPage(self.curPage + 1);
                }
            } else {
                var page = ele.html();
                if (page != self.curPage) {
                    self.curPage = parseInt(ele.html());
                    self.gotoPage(self.curPage);
                }
            }
            $(this).parent('li').addClass('active');
        });
        // 改变每页条数
        self.pnavContainer.delegate('.limit select', 'change', function () {
            volume = $(this).find("option:selected").val();
            self.rows = volume;
            if (self.curPage != 1) {
                if (self.lastPageSize) {
                    var curNum = Math.min(self.lastPageSize * (self.curPage - 1) + 1, self.totalCount);
                    self.curPage = Math.ceil(curNum / self.getPageSize());
                }
            }
            self.lastPageSize = self.getPageSize();
            self.totalPage = Math.ceil(self.totalCount / self.getPageSize());
            //
            self.gotoPage(self.curPage);
        });
        //更新页码列表显示
        this.refreshNav = function (data) {
            var html = this.pnavTpl({
                totalPage: Math.ceil(self.totalCount / getPageSize()),
                volume: getPageSize(),
                totalCount: self.totalCount,
                list: data,
                page: Math.ceil(((parseInt(data['offset']) + 1)) / data['volume']),
            });
            this.pnavContainer.empty();
            this.pnavContainer.html(html);
        };

        this.gotoPage = function (page) {
            this.loadPageFun.call(this.calle, page);
        };
    };

    this.getPageSize = function () {
        return parseInt(this.pnavContainer.find(".limit option:selected").val());
    };

    self.bind();
};