// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import {
  resource, monitor_soft, monitor, siteConfig, org, role, menu, user, log, bxAnaalyse, fileManager, systemConfig, codeGenerate, sysBaseData
} from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/views/dashboard/Analysis'),
        meta: {
          title: '首页',
          keepAlive: true,
          icon: monitor_soft
        }
      },

      {
        path: '/shisjkManager',
        redirect: '/shisjkManager',
        component: PageView,
        meta: { title: '实时监控', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/shisjkManager/voice',
          name: 'voiceList',
          component: () => import('@/views/shisjk/voice/index'),
          meta: { title: '音视频监控', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
       
        {
          path: '/shisjkManager/im',
          name: 'imList',
          component: () => import('@/views/shisjk/im/index'),
          meta: { title: 'IM消息监控', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        ]
      },




      {
        path: '/shenhManager',
        redirect: '/shenhManageer/tix/index',
        component: PageView,
        meta: { title: '审核管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/shenhManager/tix',
          name: 'tixsqList',
          component: () => import('@/views/shenh/tix/index'),
          meta: { title: '提现申请列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
       
        {
          path: '/shenhManager/dak/index',
          name: 'dakList',
          component: () => import('@/views/shenh/dak/index'),
          meta: { title: '打款审核列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        {
          path: '/shenhManager/zhub/index',
          name: 'zhubshList',
          component: () => import('@/views/shenh/zhub/index'),
          meta: { title: '资料审核列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        ]
      },

      {
        path: '/userManager',
        redirect: '/userManager/zhub/index',
        component: PageView,
        meta: { title: '用户管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/userManager/zhub/index',
          name: 'zhubList',
          component: () => import('@/views/user/zhub/index'),
          meta: { title: '主播列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }, {
          path: '/userManager/userlist/index',
          name: 'userList',
          component: () => import('@/views/user/userlist/index'),
          meta: { title: '用户列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }, {
          path: '/userManager/zhubtj/index',
          name: 'zhubtjList',
          component: () => import('@/views/user/zhubtj/index'),
          meta: { title: '推荐主播列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        , {
          path: '/userManager/fengh/index',
          name: 'fenghList',
          component: () => import('@/views/user/fengh/index'),
          meta: { title: '封号列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        {
          path: '/userManager/fengh/index2',
          name: 'fengsbList',
          component: () => import('@/views/user/fengh/index2'),
          meta: { title: '封锁设备列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
      ]
      },

      {
        path: '/chongztxManager',
        redirect: '/chongztxManager/chongz/index',
        component: PageView,
        meta: { title: '充值提现管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/chongztxManager/chongz/index',
          name: 'chongzList',
          component: () => import('@/views/chongztx/chongz/index'),
          meta: { title: '充值记录', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
          , {
          path: '/chongztxManager/tix/index',
          name: 'tixList',
          component: () => import('@/views/chongztx/tix/index'),
          meta: { title: '提现列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ]
      },



      {
        path: '/callManager',
        redirect: '/callManager',
        component: PageView,
        meta: { title: '通话管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/callManager/calllog',
          name: 'calllogList',
          component: () => import('@/views/call/calllog/index'),
          meta: { title: '通话记录', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        ]
      },


      {
        path: '/userxfManager',
        redirect: '/userxfManager/xiaof/index',
        component: PageView,
        meta: { title: '消费管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/userxfManager/xiaof/index',
          name: 'xiaofList',
          component: () => import('@/views/userxf/xiaof/index'),
          meta: { title: '用户消费记录', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }, {
          path: '/userxfManager/zhubsy/index',
          name: 'zhubsyList',
          component: () => import('@/views/userxf/zhubsy/index'),
          meta: { title: '主播收益记录', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }]
      },





      {
        path: '/inviteManager',
        redirect: '/inviteManager',
        component: PageView,
        meta: { title: '邀请管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/inviteManager/izhub',
          name: 'izhubList',
          component: () => import('@/views/invite/izhub/index'),
          meta: { title: '主播邀请列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
       
        {
          path: '/shenhManager/iuser',
          name: 'iuserList',
          component: () => import('@/views/invite/iuser/index'),
          meta: { title: '用户邀请列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        ]
      },



      {
        path: '/commentManager',
        redirect: '/commentManager/zhub/index',
        component: PageView,
        meta: { title: '动态评论管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/commentManager/comment/dongt/index',
          name: 'dongtList',
          component: () => import('@/views/comment/dongt/index'),
          meta: { title: '动态列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }, {
          path: '/commentManager/comment/comment/index',
          name: 'commentList',
          component: () => import('@/views/comment/comment/index'),
          meta: { title: '评论列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }]
      },

     



      {
        path: '/dataManager',
        redirect: '/dataManager/chongz/index',
        component: PageView,
        meta: { title: '数据中心', icon: resource, permission: ['cmgl:cmgl'] },
        children: [
        {
          path: '/dataManager/pages/userActiveData/index',
          name: 'userActiveData_bi',
          component: () => import('@/views/data/pages/userActiveData'),
          meta: { title: '用户活跃数据_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_01' } }
        },
        {
          path: '/dataManager/pages/chongzsjData/index',
          name: 'chongzsjData_bi',
          component: () => import('@/views/data/pages/chongzsjData'),
          meta: { title: '充值数据统计_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_02' } }
        },
        {
          path: '/dataManager/pages/bodthData/index',
          name: 'bodthData_bi',
          component: () => import('@/views/data/pages/bodthData'),
          meta: { title: '拨打通话数据_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_03' } }
        },
        {
          path: '/dataManager/pages/bodjtzd/index',
          name: 'bodjtzd_bi',
          component: () => import('@/views/data/pages/bodjtzd'),
          meta: { title: '拨打接听账单_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_04' } }
        },
        {
          path: '/dataManager/pages/songlsjtj/index',
          name: 'songlsjtj_bi',
          component: () => import('@/views/data/pages/songlsjtj'),
          meta: { title: '送礼数据统计_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_05' } }
        },
        {
          path: '/dataManager/pages/dongtsjtj/index',
          name: 'dongtsjtj_bi',
          component: () => import('@/views/data/pages/dongtsjtj'),
          meta: { title: '动态数据统计_bi', icon: monitor, keepAlive: true, permission: ['cmgl:cmgl'],query: { pageId: 'aliyuncs_06' } }
        },
        {
          path: '/dataManager/usertj/index',
          name: 'usertj',
          component: () => import('@/views/data/usertj/index'),
          meta: { title: '用户统计', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
          , {
          path: '/dataManager/chongztx/index',
          name: 'chongztxtj',
          component: () => import('@/views/data/chongztx/index'),
          meta: { title: '充值提现统计', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
        //  {
        //   path: '/dataManager/zaixhh/index',
        //   name: 'zaixhhtj',
        //   component: () => import('@/views/data/zaixhh/index'),
        //   meta: { title: '在线会话统计', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        // },
        {
          path: '/dataManager/zaixth/index',
          name: 'zaixthtj',
          component: () => import('@/views/data/zaixth/index'),
          meta: { title: '在线通话统计', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        },
         {
          path: '/dataManager/shouyzc/index',
          name: 'shouyzctj',
          component: () => import('@/views/data/shouyzc/index'),
          meta: { title: '收益支出统计', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ]
      },



      {
        path: '/weijckManager',
        redirect: '/weijckManager/ck/index',
        component: PageView,
        meta: { title: '违禁词库管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/dataManager/ck/index',
          name: 'ckList',
          component: () => import('@/views/weijck/ck/index'),
          meta: { title: '词库列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }]
      },

      {
        path: '/systemManager',
        redirect: '/systemManager/appUpdateList/index',
        component: PageView,
        meta: { title: '系统管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [
          {
            path: '/systemManager/management/paramter/index',
            name: 'paramterList',
            component: () => import('@/views/system/management/paramter/index'),
            meta: { title: '系统参数设置', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/systemManager/management/appconfig/index',
            name: 'appConfigList',
            component: () => import('@/views/system/management/appconfig/index'),
            meta: { title: '版本审核设置', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },

          {
            path: '/systemManager/management/banner/index',
            name: 'bannerList',
            component: () => import('@/views/system/management/banner/index'),
            meta: { title: 'banner设置', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },//E:\space\chat-manager-ui\src\views\system\management\recharge\index.vue
          {
            path: '/systemManager/management/recharge/index',
            name: 'rechargeList',
            component: () => import('@/views/system/management/recharge/index'),
            meta: { title: '充值金额设置', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/systemManager/appUpdateList/index',
            name: 'appUpdateList',
            component: () => import('@/views/system/update/index'),
            meta: { title: 'APP更新提示', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },{
          path: '/systemManager/ad/index',
          name: 'adList',
          component: () => import('@/views/system/ad/index'),
          meta: { title: '广告管理', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ,{
          path: '/systemManager/gift/index',
          name: 'giftList',
          component: () => import('@/views/system/gift/index'),
          meta: { title: '礼物管理', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ]
      },



      {
        path: '/messageManager',
        redirect: '/messageManager/xiaozs/index',
        component: PageView,
        meta: { title: '消息管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/messageManager/xiaozs/index',
          name: 'xiaozsList',
          component: () => import('@/views/message/xiaozs/index'),
          meta: { title: '小助手消息', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
          , {
          path: '/messageManager/appsingle/index',
          name: 'appsingleList',
          component: () => import('@/views/message/appsingle/index'),
          meta: { title: 'APP单次推送消息', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }, {
          path: '/messageManager/appmany/index',
          name: 'appmanyList',
          component: () => import('@/views/message/appmany/index'),
          meta: { title: 'APP多次推送消息', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ]
      },


      {
        path: '/accountManager',
        redirect: '/accountManager/account/index',
        component: PageView,
        meta: { title: '账号管理', icon: resource, permission: ['cmgl:cmgl'] },
        children: [{
          path: '/accountManager/account/index',
          name: 'accountList',
          component: () => import('@/views/account/account/index'),
          meta: { title: '账号列表', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
          , {
          path: '/accountManager/role/index',
          name: 'roleList',
          component: () => import('@/views/account/role/index'),
          meta: { title: '角色管理', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
        }
        ]
      },



      
      {
        path: '/otherManager',
        component: PageView,
        meta: { title: '其他不可见页面', icon: resource, permission: ['cmgl:cmgl'] },
        children: [
          {
            path: '/shenhManager/tix/tixsh',
            name: 'tixsh',
            component: () => import('@/views/shenh/tix/handle'),
            meta: { title: '提现-审核', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/shenhManager/zhub/zhubsh',
            name: 'zhubsh',
            component: () => import('@/views/shenh/zhub/handle'),
            meta: { title: '主播-审核', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/userManager/zhub/handle',
            name: 'zhubDetail',
            component: () => import('@/views/user/zhub/handle'),
            meta: { title: '主播-详情', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/userManager/userlist/handle',
            name: 'userDetail',
            component: () => import('@/views/user/userlist/handle'),
            meta: { title: '用户-详情', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          {
            path: '/systemManager/management/appconfig/handle',
            name: 'configDetail',
            component: () => import('@/views/system/management/appconfig/handle'),
            meta: { title: '版本审核-详情', icon: user, keepAlive: true, permission: ['cmgl:cmgl'] },
          },
          
        ]
      },

    ]
  },
  // Exception
  {
    path: '/exception',
    name: 'exception',
    component: RouteView,
    redirect: '/exception/403',
    meta: {
      title: '异常页',
      icon: 'warning',
      permission: ['exception']
    },
    children: [{
      path: '/exception/403',
      name: 'Exception403',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      meta: {
        title: '403',
        permission: ['exception']
      }
    },
    {
      path: '/exception/404',
      name: 'Exception404',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      meta: {
        title: '404',
        permission: ['exception']
      }
    },
    {
      path: '/exception/500',
      name: 'Exception500',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      meta: {
        title: '500',
        permission: ['exception']
      }
    }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
  },
  {
    path: 'register-result',
    name: 'registerResult',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
  }
  ]
},

{
  path: '/test',
  component: BlankLayout,
  redirect: '/test/home',
  children: [{
    path: 'home',
    name: 'TestHome',
    component: () => import('@/views/Home')
  }]
},

{
  path: '/404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}
]
