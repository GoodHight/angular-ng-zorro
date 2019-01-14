
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ScrollService } from '@delon/theme';
import { AddressService } from './service/address.service';


declare let AMap: any;
declare let AMapUI: any;
@Component({
  selector: 'attendance-address',
  templateUrl: './attendance-address.component.html',
  styleUrls: ['./attendance-address.component.less']
})
export class AttendanceAddressComponent implements OnInit {

  switchValue = false;
  
  public tabSelectIndex = 1;
  guid: '';
  tabs = [];
  
  constructor(
    private addressService: AddressService,
    private nzModalService: NzModalService,
    private fb: FormBuilder, 
    private msg: NzMessageService,
    private router: Router, 
    private route: ActivatedRoute,
    public scroll: ScrollService) {
  }

  // table list property
  public dataSet = [];
  public loading = false;


  // add or update modal 
  form: FormGroup;
  isVisible = false;
  public modalTitle = '新增考勤地址';
  public selectModalType = 1;

  public viewModel = {
    guid: '',
    enterpriseId: '',
    name: '',
    site: '',
    effectiveRange: '100',
    coordinate: ''
  };

  // map property
  // current postion
  public currentPosition = {
    lng: '',
    lat: ''
  };

  public map: any = null;
  public marker: any = null;
  public circle: any = null;

  /**
   * refresh table data.
   */
  refreshNzTable(): void {
    this.loading = true;
    this.getData();
  }


  getData(): void {
    this.addressService.getData()
    .subscribe((response: any) => {
      if (response.code === 0) {
        this.dataSet = response.data;
        this.loading = false;
      }

    });
  }

  /**
   * delete current row...
   * @param guid groupid
   * @param name group name
   */
  deleteGroup(guid: string, name: string): void {
    this.nzModalService.confirm({
      nzTitle: '删除考勤地址',
      nzContent: `<span style="color: red !important;">确定删除 <strong>${ name }</strong> 吗?</span>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.addressService.deleteAddressById(guid)
        .subscribe((res) => {
          this.refreshNzTable();
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }


  /**
   * open modal of add function or update function.
   * @param type 1 add, 2 update
   * @param model 
   */
  openModal(type: number, model: any): void {
    this.selectModalType = type;
    // add
    if (type === 1) {
      this.modalTitle = '新增考勤地址';
    }
    // update
    if (type === 2) {
      this.modalTitle = '编辑考勤地址';
      // this.viewModel.name = model;
      this.viewModel.guid = model.guid;
      this.viewModel.name = model.name;
      this.viewModel.site = model.site;
      this.viewModel.effectiveRange = model.effectiveRange;
      this.viewModel.coordinate = model.coordinate;
    }
    this.isVisible = true;
    this.initMap();
  }




  handleOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[ i ].markAsDirty();
      this.form.controls[ i ].updateValueAndValidity();
    }
    // status === 'VALID' or 'INVALID'
    // valid === true or false
    if (this.form.status !== 'VALID' || !this.form.valid) {
      this.msg.error('验证不通过,请仔细检查.');
      return;
    }
    this.isVisible = false;
    // name 
    this.viewModel.name = this.form.value.name;
    this.viewModel.coordinate = [this.currentPosition.lng, this.currentPosition.lat].join(',');
    if (this.selectModalType === 1) {
      this.addressService.addGroup(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    } else {
      this.addressService.updateGroup(this.viewModel)
      .subscribe(res => {
        this.refreshNzTable();
      });
    }
    
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  to(item: any) {
    this.router.navigateByUrl(`${item.key}`).then();
  }


  ngOnInit() {
    // init table 
    this.refreshNzTable();
    this.form = this.fb.group({
      name: [ '', [ Validators.required ] ],
      workday: [],
      classtimes: [],
      address: []
    });
    this.route.params
      .subscribe((params: Params) => {
        // this.guid = params['guid'];
        this.tabs = [{
          key: '/attendance/setting/index',
          tab: '免考勤规则',
        },
        {
          key: '/attendance/setting/address',
          tab: '考勤地址',
        },
        {
          key: '/attendance/setting/workday',
          tab: '工作日设置',
        },
        {
          key: '/attendance/setting/shift',
          tab: '班次设置',
        }];
      });
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.getPosition();
  }

  initMap(): void {
    const _this_ = this;
    this.map = new AMap.Map('container', {
      zoom: 16,
      scrollWheel: true,
      center: [this.currentPosition.lng, this.currentPosition.lat]
    });
    // 构造点标记
    this.marker = new AMap.Marker({
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      position: [this.currentPosition.lng, this.currentPosition.lat]
    });
    // 构造矢量圆形
    this.circle = new AMap.Circle({
      center: new AMap.LngLat(this.currentPosition.lng, this.currentPosition.lat), // 圆心位置
      radius: 100,  // 半径
      strokeColor: '#F33',  // 线颜色
      strokeOpacity: 1,  // 线透明度
      strokeWeight: 1,  // 线粗细度
      fillColor: '#ee2200',  // 填充颜色
      fillOpacity: 0.35 // 填充透明度
    });

    if (this.viewModel.effectiveRange) {
      this.circle.setRadius(parseInt(this.viewModel.effectiveRange, 10));
    }

    // 将以上覆盖物添加到地图上
    // 单独将点标记添加到地图上
    // this.map.add(this.marker);
    // add方法可以传入一个覆盖物数组，将点标记和矢量圆同时添加到地图上
    this.map.add([this.marker, this.circle]);

    // 绑定事件
    this.map.on('click', event => {
      this.currentPosition.lng = event.lnglat.getLng();
      this.currentPosition.lat = event.lnglat.getLat();
      this.queryGeocode();
      this.refreshPosition();
    });


    AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

      const poiPicker = new PoiPicker({
          input: 'pickerInput'
      });

      // 初始化poiPicker
      // 选取了某个POI
      poiPicker.on('poiPicked', function(poiResult) {
        const poi = poiResult.item;
        const name = poi.name;
        const address = poi.address;
        const location = poi.location;
        _this_.viewModel.site = '[' + name + '] ' + address;
        _this_.currentPosition.lng = location.lng;
        _this_.currentPosition.lat = location.lat;
        _this_.refreshPosition();
      });

    });
  }

  effectiveRangeChange(v): void {
    if (this.circle) {
      this.circle.setRadius(v);
    }
  }

  getPosition(): void {
    // http not surpport
    this.currentPosition = {
      lng: '106.509284',
      lat: '29.610147'
    };
  }

  refreshPosition(): void {
    this.map.setCenter([this.currentPosition.lng, this.currentPosition.lat]);
    this.marker.setPosition([this.currentPosition.lng, this.currentPosition.lat]);
    this.circle.setCenter([this.currentPosition.lng, this.currentPosition.lat]);
  }

  queryGeocode(): void {
    const _this_ = this;
    AMap.plugin('AMap.Geocoder', function() {
      const geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010'
      });
     
      const lnglat = [_this_.currentPosition.lng, _this_.currentPosition.lat];
    
      geocoder.getAddress(lnglat, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            _this_.viewModel.site = result.regeocode.formattedAddress;
        }
      });
    });
 
  }

}
