//status 对应
export const dataStatus = {
    "-1":'无',
    "0": '未审核',
    "10": '审核中',
    "20": '审核未通过',
    "21": '审核取消',
    "22": '审核冻结',
    "30": '审核通过，待打款',
    "40": '打款完成',
    "41": '打款失败',
    "42": '部分打款',
    "43": '打款冻结',
};

//status 充值状态
export const chongzStatus = {
    "-1":'无',
    "1": '充值中',
    "10": '充值失败',
    "11": '取消充值',
    "20": '充值完成',
    "30": '全部退款',
    "31": '部分退款',
};

//status 对应
export const anchorStatus = {
    "-1":'无',
    "10": '待审核',
    "20": '审核未通过',
    "30": '审核通过',
};


//type 资料类型
export const dataTypes = {
    "null":'无',
    "1": '个人资料',
    "2": '相册',
    "3": '视频',
    "4": '守护相册',
    "5": '守护视频',
    "6": '认证视频',
};


//type 资料类型
export const anchorRecommendTypes = {
    "null":'无',
    "0": '首页推荐一',
    "6": '首页推荐二',
    "7": '首页推荐三',
    "1": '首页活跃',
    "2": '首页新人',
    // "3": '全局-推荐池',
    "3": '推荐池-私信',
    "4": '推荐池-视频',
    "5": '审核池',
};


//type 资料类型
export const genderTypes = {
    "null":'-',
    "0": '女',
    "1": '男',
};

export const sortColumnTypes ={
    'createTime':'0',    //注册时间
    'activeTime':'1',    //最近登录时间 
    'coin':'2',          //账户余额
    'giftProfit':'3',    //礼物收益 
    'messageProfit':'4', //私信收益
    'audioProfit':'5',   //语音收益 
    'audioDuration':'6', //语音时长
    'videoProfit':'7',   //视频收益
    'videoDuration':'8', //视频时长
}

export const sortDirectionTypes= {
    'ascend':'0',    //注册时间
    'descend':'1',    //最近登录时间 
}

//通话记录
export const callTypes= { 
    '0':'音频',    //注册时间
    '1':'视频',    //最近登录时间 
}


//通话记录
export const dyamicTypes= { 
    '1':'机审通过',  
    '2':'人工审核通过',   
}

//动态审核状态
export const dyamicAuditTypes= { 
    1:'审核中',   
    10:'审核通过', 
    20:'审核不通过',   
}

//bi数据地址
export const pagesUrl= { 
    'aliyuncs_01':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=654c1f19-ecb0-47bd-96eb-b0972d7c9965&accessToken=f1a3a1a4b9ce4652e71f8949aef56f48',    //用户活跃数据_bi
    'aliyuncs_02':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=872738a8-c599-46a5-a1c8-3143a949cd9f&accessToken=ad37669652a78f437a8fcf1dc3011eef',    //充值数据统计_bi 
    'aliyuncs_03':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=15614060-a22b-40e8-b773-33eb77d40787&accessToken=17d46c6a13c008d9dc554a050dbb4851',    //拨打通话数据_bi 
    'aliyuncs_04':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=15614060-a22b-40e8-b773-33eb77d40787&accessToken=17d46c6a13c008d9dc554a050dbb4851',    //拨打接听账单_bi 
    'aliyuncs_05':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=eda7cb26-161c-4450-a693-5ff550334a95&accessToken=604847a374234ec8c50f3f39a5a346b2',    //送礼数据统计_bi 
    'aliyuncs_06':'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=bc52aedf-1209-43ce-b654-f0e5cb6e2f7f&accessToken=82085a7bc98f63ba7cda941dac3b057f',    //动态数据统计_bi 
}


//type 资料类型
export const dynamicDTType = {
    "0": '普通动态',
    "1": '守护动态',
};