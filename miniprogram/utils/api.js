const ApiRootUrl = 'https://www.wubaotop.cn';

module.exports = {
  //自动登录API
  LoginUrl: ApiRootUrl + '/lostAppUser/login', 
  //获取寻物启事和失物招领列表接口
  LostModelListUrl: ApiRootUrl + '/lostModel/getModelList', 
  //获取寻物启事和失物招领详情接口
  LostModelUrl: ApiRootUrl + '/lostModel/getLostModel',  
  //添加寻物启事和失物招领接口
  AddModelUrl: ApiRootUrl +'/lostModel/add',
  //获取搜索结果接口
  SearchResultUrl: ApiRootUrl + '/lostModel/search',
  //获取是否收藏帖子接口
  IsCollectUrl: ApiRootUrl + '/lostAppUser/isCollect',
  //收藏帖子接口
  CollectUrl: ApiRootUrl + '/lostAppUser/addCollection', 
  //获取小程序码接口
  QRCordUrl: ApiRootUrl + '/lostModel/qrCode',
  //获取用户基本信息接口
  UserMsgUrl: ApiRootUrl + '/lostAppUser/getUser',  
  //用户更新基本信息接口
  UpdateUserMsgUrl: ApiRootUrl + '/lostAppUser/update',  
  //获取我发布帖子列表接口
  MyLostModelListUrl: ApiRootUrl + '/lostAppUser/getMyModels', 
  //删除帖子接口
  RemoveModelUrl: ApiRootUrl + '/lostModel/remove', 
  //修改帖子状态接口 
  HaveFoundUrl: ApiRootUrl + '/lostAppUser/haveFound', 
  //修改帖子信息接口
  UpdateModelUrl: ApiRootUrl + '/lostModel/update' ,
  //获取我的收藏列表接口
  CollectionListUrl: ApiRootUrl + '/lostAppUser/getMyCollection', 
  //取消收藏接口
  RemoveCollectionUrl: ApiRootUrl+'/lostAppUser/removeCollection',
}