import { DOCUMENT, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as echarts from 'echarts';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import * as moment from 'moment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    filters: any = '';
    orderData: any;
    allOrderData: any;
    endPointAmazon: string = '/admin-amazon/get-amazon-data'
    endPointWalmart: string = '/admin-walmart/get-walmart-data'
    items: any;
    totalRows: number = 0;
    pageSize: number = 10;
    currentPage: any = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    startDate: any;
    endDate: any;
    activeRange: any;
    selectedTabInventory: any = 'amazon';
    selectedTabOrders: any = 'all';
    inventoryCounts: any = {};
    AmazonInventoryCounts: any = {};
    walmartAuthorize: any;
    amazonAuthorize: any;
    amazonOrderData: any;
    walmartOrderData: any;
    chartData: any;
    graphOrderData: any;


    constructor(@Inject(DOCUMENT) private document: Document,
        private datepipe: DatePipe,
        private decimalpipe: DecimalPipe,
        private _authService: AuthService,
        private toastrService: ToastrNotificationService,
    ) { }

    ngOnInit(): void {
        this.setDateRange('6m');
        let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
        let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
        userData = Object.keys(userData).length !== 0 ? userData : adminData

        this.walmartAuthorize = JSON.parse(localStorage.getItem('walmartAuthorize') || '{}');
        this.amazonAuthorize = JSON.parse(localStorage.getItem('amazonAuthorize') || '{}');

        this.getItems();
    }

    selectSection(section: any) {
        this.selectedTabInventory = section;

        if (this.items && this.items.length) {

            var inTransitItems: any = 0;
            var preparationItems: any = 0;
            var problemItems: any = 0;
            var sentToAmazonItems: any = 0;

            let itemData = this.items.filter((item: any) => { return item?.platform?.toLowerCase() == section });

            itemData.filter((item: any) => {

                if (item?.platform?.toLowerCase() == 'walmart') {
                    if (item?.inventoryDetails?.publishedStatus === 'IN_PROGRESS') {
                        inTransitItems = inTransitItems + 1;
                    }
                    if (item?.inventoryDetails?.publishedStatus === 'UNPUBLISHED') {
                        preparationItems = preparationItems + 1;
                    }
                    if (item?.inventoryDetails?.publishedStatus === 'SYSTEM_PROBLEM') {
                        problemItems = problemItems + 1;
                    }
                    if (item?.inventoryDetails?.publishedStatus === 'PUBLISHED') {
                        sentToAmazonItems = sentToAmazonItems + 1;
                    }
                }

                if (item?.platform?.toLowerCase() == 'amazon') {
                    if (item?.inventoryDetails?.inboundWorkingQuantity != 0) {
                        inTransitItems = inTransitItems + 1;
                    }
                    if (item?.inventoryDetails?.inboundShippedQuantity != 0) {
                        preparationItems = preparationItems + 1;
                    }
                    if (item?.inventoryDetails.researchingQuantity?.totalResearchingQuantity != 0) {
                        problemItems = problemItems + 1;
                    }
                    if (item?.inventoryDetails?.fulfillableQuantity != 0) {
                        sentToAmazonItems = sentToAmazonItems + 1;
                    }
                }
            })

            this.inventoryCounts = {
                inTransitCount: inTransitItems,
                preparationCount: preparationItems,
                problemCount: problemItems,
                sentToAmazonCount: sentToAmazonItems
            }
        }

    }

    selectSectionOrders(section: any) {
        this.selectedTabOrders = section;
        if (section == 'amazon' || section == 'walmart') {
            this.filters = '';
            this.filters = '&filter=true&platform=' + section
        } else {
            this.filters = '';
        }
        this.getOrders();
    }

    getOrdersForGraphAmazon() {
        let endpoint = '/admin-walmart/get-orders-data?startDate=' + this.startDate + '&endDate=' + this.endDate + '&platform=amazon';

        this._authService.setLoader(true);
        this._authService.sendRequest('get', endpoint, '').subscribe((respData: any) => {
            this.amazonOrderData = respData?.result?.data?.rows
            this.recentChart(this.amazonOrderData)
            this.barChart();
            this._authService.setLoader(false);

        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    getOrdersForGraphWalmart() {
        let endpoint = '/admin-walmart/get-orders-data?startDate=' + this.startDate + '&endDate=' + this.endDate + '&platform=walmart';

        this._authService.setLoader(true);
        this._authService.sendRequest('get', endpoint, '').subscribe((respData: any) => {
            this.walmartOrderData = respData?.result?.data?.rows
            this.recentChart(this.walmartOrderData)
            this.barChart();
            this._authService.setLoader(false);

        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    getOrders() {
        let filters = this.selectedTabOrders == 'all' ? '' : '&sellingPartner=' + this.selectedTabOrders;
        let endpoint = '/admin-amazon/get-analytics?page=' + (parseInt(this.currentPage) + 1) + '&pageSize=' + this.pageSize + '&startDate=' + this.startDate + '&endDate=' + this.endDate + filters;

        this._authService.setLoader(true);
        this._authService.sendRequest('get', endpoint, '').subscribe((respData: any) => {
            this.orderData = respData?.result?.totalOrdersData
            this.totalRows = respData?.result?.totalOrders
            this._authService.setLoader(false);
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    recentChart(data?: any) {

        setTimeout(() => {
            if ((this.amazonOrderData || this.amazonOrderData?.length == 0) && (this.walmartOrderData || this.walmartOrderData?.length == 0)) {

                var amazonData: any = [];
                var walmartData: any = [];

                this.amazonOrderData.forEach((item: any) => {
                    const formattedDate = this.datepipe.transform(item.orderDate, 'yyyy-MM-dd');
                    item.amount = !item.amount ? 0 : item.amount;
                    const roundedRevenue = parseFloat(item.amount);

                    const existingDateIndex = amazonData.findIndex((entry: any) => entry.date === formattedDate);
                    if (existingDateIndex !== -1) {
                        amazonData[existingDateIndex].revenue += roundedRevenue;
                    } else {
                        amazonData.push({ date: formattedDate, revenue: roundedRevenue });
                    }
                });

                this.walmartOrderData.forEach((item: any) => {
                    const formattedDate = this.datepipe.transform(item.orderDate, 'yyyy-MM-dd');
                    item.amount = !item.amount ? 0 : item.amount;
                    const roundedRevenue = parseFloat(item.amount);

                    const existingDateIndex = walmartData.findIndex((entry: any) => entry.date === formattedDate);
                    if (existingDateIndex !== -1) {
                        walmartData[existingDateIndex].revenue += roundedRevenue;
                    } else {
                        walmartData.push({ date: formattedDate, revenue: roundedRevenue });
                    }
                });


                var chartDom: any = this.document.getElementById('chartjs-dashboard-line')!;

                var myChart = echarts.init(chartDom);

                const colors = ['#7eb067', '#5470C6'];
                var option = {
                    color: amazonData?.length > 0 && walmartData?.length > 0 ? ['#7eb067', '#5470C6'] : amazonData?.length > 0 ? ['#5470C6'] : walmartData?.length > 0 ? ['#7eb067'] : [],
                    tooltip: {
                        backgroundColor: '#fff',
                        formatter: (res: any) => {
                            return `<div style="margin: 0px 0 0;line-height:1; padding:5px;">
                                        <div style="margin: 0px 0 0;line-height:1;">${res.marker}
                                            <span style="font-size:15px;color:#c2c2c2;font-weight:400;margin-left:2px">${res.name}</span>
                                            <span style="float:right;margin-left:20px;font-size:15px;color:#c2c2c2;font-weight:900">$${this.decimalpipe.transform(res.data, '1.2-2')}</span>
                                            <div style="clear:both"></div>
                                        </div>
                                        <div style="clear:both"></div>
                                    </div>`;
                        }
                    },
                    legend: {
                        textStyle: {
                            color: '#555',
                            fontSize: '15px'
                        }
                    },
                    grid: {
                        top: 70,
                        bottom: 50
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: amazonData?.length > 0 ? colors[1] : '#C2C2C2'
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: (params: any) => {
                                        return (
                                            'Precipitation  ' +
                                            params.value +
                                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                                        );
                                    }
                                }
                            },
                            data: []
                        },
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: walmartData?.length > 0 ? colors[0] : '#C2C2C2'
                                }
                            },
                            axisPointer: {
                                label: {
                                    formatter: (params: any) => {
                                        return (
                                            'Precipitation  ' +
                                            params.value +
                                            (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                                        );
                                    }
                                }
                            },
                            data: []
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: amazonData?.length > 0 && walmartData?.length > 0 ? [
                        {
                            name: 'Walmart',
                            type: 'line',
                            xAxisIndex: 1,
                            smooth: true,
                            data: []
                        },
                        {
                            name: 'Amazon',
                            type: 'line',
                            smooth: true,
                            data: []
                        }
                    ] : amazonData?.length > 0 ? [
                        {
                            name: '',
                            data: [],
                            xAxisIndex: 1,
                            type: 'line',
                            smooth: true
                        },
                        {
                            name: 'Amazon',
                            data: [],
                            type: 'line',
                            smooth: true
                        },
                    ] : walmartData?.length > 0 ? [
                        {
                            name: 'Walmart',
                            data: [],
                            xAxisIndex: 1,
                            type: 'line',
                            smooth: true
                        },
                    ] : [],
                };


                if (amazonData?.length > 0 && walmartData?.length > 0) {
                    let amazonDate = amazonData.map((entry: any) => entry.date);
                    option.xAxis[0].data = amazonDate;
                    option.series[1].data = amazonData.map((entry: any) => entry.revenue);

                    let walmartDate = walmartData.map((entry: any) => entry.date);
                    option.xAxis[1].data = walmartDate;
                    option.series[0].data = walmartData.map((entry: any) => entry.revenue);

                } else if (amazonData?.length > 0) {
                    option.xAxis[0].data = amazonData.map((entry: any) => entry.date);
                    option.series[1].data = amazonData.map((entry: any) => entry.revenue);
                } else if (walmartData?.length > 0) {
                    option.xAxis[1].data = walmartData.map((entry: any) => entry.date);
                    option.series[0].data = walmartData.map((entry: any) => entry.revenue);
                }

                option && myChart.setOption(option, true);
            }
        }, 500);
    }

    barChart() {
        setTimeout(() => {
            if (this.amazonOrderData != null && this.walmartOrderData != null) {
                var yearswalmart: any[] = [];
                var yearsAmazon: any[] = []
                var series: any = [];
                var amazonRevenue: any = [];
                var walmartRevenue: any = [];

                this.amazonOrderData.forEach((item: any) => {
                    var orderYear: any = this.datepipe.transform(item.orderDate, 'yyyy');
                    item.amount = !item.amount ? 0 : item.amount;
                    const orderRevenue = parseFloat(item.amount);

                    if (!yearsAmazon.includes(orderYear)) {
                        yearsAmazon.push(orderYear);
                        amazonRevenue.push(orderRevenue);
                    } else {
                        var index = yearsAmazon.indexOf(orderYear);
                        amazonRevenue[index] += orderRevenue;
                    }
                });

                this.walmartOrderData.forEach((item: any) => {
                    var orderYear: any = this.datepipe.transform(item.orderDate, 'yyyy');
                    item.amount = !item.amount ? 0 : item.amount;
                    const orderRevenue = parseFloat(item.amount);

                    if (!yearswalmart.includes(orderYear)) {
                        yearswalmart.push(orderYear);
                        walmartRevenue.push(orderRevenue);
                    }
                    else {
                        var index = yearswalmart.indexOf(orderYear);
                        if (walmartRevenue[index]) {
                            walmartRevenue[index] += orderRevenue;
                        }
                    }

                });

                var chartDom: any = document.getElementById('barchart')!;
                var myChart = echarts.init(chartDom);

                var option;

                var sourceData: any = [];
                sourceData.push(['years'].concat([...new Set([...yearsAmazon, ...yearswalmart])]));

                if (amazonRevenue.length > 0 && walmartRevenue.length > 0) {
                    sourceData.push(['Amazon'].concat(amazonRevenue));
                    sourceData.push(['Walmart'].concat(walmartRevenue));
                } else if (walmartRevenue.length > 0) {
                    sourceData.push(['Walmart'].concat(walmartRevenue));
                } else {
                    sourceData.push(['Amazon'].concat(amazonRevenue));
                }

                [...new Set([...yearsAmazon, ...yearswalmart])].forEach((r) => {
                    series.push({ type: 'bar', barWidth: '20%', })
                })

                if (sourceData && sourceData.length) {
                    option = {
                        legend: {
                            textStyle: {
                                color: '#555',
                                fontSize: '15px'
                            }
                        },
                        dataset: {
                            source: sourceData
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            formatter: (res: any) => {
                                return `<div style="margin: 0px 0 0;line-height:1; padding:5px;">
                              <div style="margin: 0px 0 0;line-height:1;">${res.marker}
                                <span style="font-size:15px;color:#c2c2c2;font-weight:400;margin-left:2px">${res.name}</span>
                                <span style="float:right;margin-left:20px;font-size:15px;color:#c2c2c2;font-weight:900">$${this.decimalpipe.transform(res.seriesName == 2023 ? res.value[1] : res.value[2], '1.2-2')}</span>
                                <div style="clear:both"></div>
                              </div>
                              <div style="clear:both"></div>
                            </div>`
                            }
                        },
                        xAxis: {
                            type: 'category',
                            axisLabel: {
                                color: '#c2c2c2'
                            }
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series
                    };

                    option && myChart.setOption(option, true);
                }
            }
        });
    }

    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getOrders();
    }

    getItems() {
        let endpoint = '/admin-walmart/get-inventory-data';
        this._authService.setLoader(true);
        this._authService.sendRequest('GET', endpoint, '').subscribe((respData: any) => {
            this.items = respData.result?.data?.rows;
            this.items.map((i: any) => i.inventoryDetails = JSON.parse(i.inventoryDetails));
            this._authService.setLoader(false);
            this.selectSection(this.selectedTabInventory);
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });

    }

    setDateRange(range: string): void {
        const now = new Date();
        this.endDate = moment(new Date(now)).format('Y-M-D');

        switch (range) {
            case '7d':
                this.startDate = moment(now.getTime() - 7 * 24 * 60 * 60 * 1000).format('Y-M-D');
                break;
            case '30d':
                this.startDate = moment(now.getTime() - 30 * 24 * 60 * 60 * 1000).format('Y-M-D');
                break;
            case '6m':
                this.startDate = moment(new Date(now.getFullYear(), now.getMonth() - 6, 1)).format('Y-M-D');
                break;
            case '1y':
                this.startDate = moment(new Date(now.getFullYear() - 1, 0, 1)).format('Y-M-D');
                break;
            default:
                console.error(`Invalid date range: ${range}`);
                return;
        }

        this.activeRange = range;
        this.getOrders();
        this.currentPage = 0;
        this.getOrdersForGraphAmazon();
        this.getOrdersForGraphWalmart();
    }

}

