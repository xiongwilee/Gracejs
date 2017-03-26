'use strict';

let userAuthor = require('../dashboard/userAuthor');

exports.aj_cate_list = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo, false, true)) {
    return
  };

  this.body = this.siteInfo.cates;
};
exports.aj_cate_list.__method__ = 'all';


exports.aj_post_delete = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo, false, true)) {
    return
  };

  let id = this.request.body.id;
  let result = {
    code: 0,
    message: ''
  };

  let PostModel = this.mongo('Post');
  let CateModel = this.mongo('Category');

  let post = await PostModel.deletePost(id);

  if (!post) {
    result.code = 1;
    result.message = '文章不存在！';

    this.body = result;
    return;
  }

  if (post.category) {
    let cate = await CateModel.updateCateNum(post.category);

    this.body = result;
    return;
  } else {
    this.body = result;
    return;
  }
};
exports.aj_post_delete.__method__ = 'all';

/**
 * 校验请求参数是否合法
 * @param  {Object} data 请求参数
 * @return {String}      错误信息
 */
function _validatePostData(data) {
  let message;
  let params = [
    ['secret_id', 'String', true, '您在第一步获取的secret_id'],
    ['is_new', 'String', true, "是否新建博客，可选0、1两个值：''0'，编辑博客；‘1’，新建博客"],
    ['id', 'String', true, '博客的ID，即博客唯一ID，支持数字、大小写字母、下划线、中划线，保存后不可更改'],
    ['title', 'String', true, '博客标题，可以是任意字符'],
    ['image', 'String', false, '博客主题图片，如果有则显示，目前仅在博客列表页（首页）中显示'],
    ['from', 'String', false, '博客来源，博客文章在您的博客网站中的链接'],
    ['content', 'String', true, '博客Markwown源码'],
    ['htmlContent', 'String', true, '博客markdown编译之后的html内容，用以展示在文档内容页'],
    ['introContent', 'String', true, '博客html格式的介绍内容，用以展示再文档列表页'],
    ['category', 'String', true, '博客分类的id，文档分类必须从博客分类列表接口中获取']
  ];

  for (let i = 0; i < params.length; i++) {
    let item = params[i];
    let key = item[0];

    if (item[2] && !data[key]) {
      message = '缺少参数：' + key + '，该参数为' + item[3];
      break;
    }
  }

  return message;
}

exports.aj_edit = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo, false, true)) {
    return
  };

  let data = this.request.body;
  let is_new = data.is_new;
  let author = data.author || this.userInfo.id;
  let category = data.category;
  let result = {
    code: 0,
    message: ''
  };
  let tag = data.tag ? data.tag.split(',') : [];

  // 校验数据
  result.message = _validatePostData(data);
  if (result.message) {
    result.code = 2;
    return;
  }

  // 校验分类数据
  if (!this.siteInfo.cates_item || !this.siteInfo.cates_item[category]) {
    result.code = 3;
    result.message = '没有找到对应的文章分类';

    this.body = result;
    return;
  }

  let PostModel = this.mongo('Post', {
    id: data.id,
    title: data.title,
    image: data.image,
    from: data.from,
    author: author,
    content: data.content,
    htmlContent: data.htmlContent,
    introContent: data.introContent,
    category: category,
    tag: tag
  });

  let doc = await PostModel.getPostById(data.id);

  if (is_new == 1 && doc) {
    result.code = '1';
    result.message = '文章已经存在，请勿重复添加！';

    this.body = result;
    return;
  } else if (is_new == 0 && !doc) {
    is_new = 1;
  }

  let res = await PostModel.edit(is_new);

  let CateModel = this.mongo('Category');
  if (is_new == 1) {
    await CateModel.updateCateNum(data.category);
  } else if (doc.category != data.category) {
    // 更新doc原分类的数量及doc现分类的数量
    await this.mongoMap([{
      model: CateModel,
      fun: CateModel.updateCateNum,
      arg: [data.category]
    }, {
      model: CateModel,
      fun: CateModel.updateCateNum,
      arg: [doc.category]
    }]);
  }


  this.body = result;
}
exports.aj_edit.__method__ = 'all';
