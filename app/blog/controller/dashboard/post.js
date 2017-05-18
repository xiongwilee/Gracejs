'use strict';

let userAuthor = require('./userAuthor');

exports.list = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let pageNum = this.query.page;

  let PostModel = this.mongo('Post');
  let posts = await PostModel.page(pageNum, 20);
  let page = await PostModel.count(pageNum, 20);

  await this.render('dashboard/post_list', {
    breads: ['文章管理', '文章列表'],
    posts: posts,
    page: page,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}


exports.aj_post_delete = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let id = this.request.body.id;
  let result = { code: 0, message: '' };

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
exports.aj_post_delete.__method__ = 'post';

exports.aj_edit = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let data = this.request.body;
  let is_new = data.is_new;
  let author = data.author || userInfo.id;
  let category = data.category;
  let result = { code: 0, message: '' };

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
    category: data.category
  });

  let doc = await PostModel.getPostById(data.id);

  if (is_new == 1 && doc) {
    result.code = '1';
    result.message = '文章已经存在，请勿重复添加！';

    this.body = result;
    return;
  } else if (is_new == 0 && !doc) {
    result.code = '2';
    result.message = '文章不存在，无法编辑！';

    this.body = result;
    return;
  }

  let res = await PostModel.edit(is_new);

  // 更新分类数量
  let CateModel = this.mongo('Category');
  if (is_new == 1) {
    await CateModel.updateCateNum(data.category);
  } else if (doc && doc.category !== data.category) {
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
exports.aj_edit.__method__ = 'post';


exports.edit = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let post;
  let post_id = this.query.id;

  if (post_id) {
    post = await this.mongo('Post').getPostById(post_id);
    if (!post) {
      this.body = '文章不存在';
      return;
    }
  }

  await this.render('dashboard/post_edit', {
    isNew: !post_id ? 1 : 0,
    breads: ['文章管理', (!post_id ? '新文章' : '编辑文章')],
    post: post,
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}


exports.aj_cate_delete = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let id = this.request.body.id;
  let result = { code: 0, message: '' };

  let CateModel = this.mongo('Category');

  let cate = await CateModel.deleteCate(id);

  if (!cate) {
    result.code = 1;
    result.message = '分类不存在！';
  } else if (cate.numb > 0) {
    result.code = 2;
    result.message = '该分类下还有文章，请删除后再试';
  }

  this.body = result;
  return;
};
exports.aj_cate_delete.__method__ = 'post';


exports.aj_cate_edit = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  let data = this.request.body;
  let is_new = data.is_new;
  let result = { code: 0, message: '' };

  let CateModel = this.mongo('Category', {
    id: data.id,
    name: data.name,
    numb: data.numb
  });

  let doc = await CateModel.getCategoryById(data.id);

  if (is_new == 1 && doc) {
    result.code = '1';
    result.message = '分类已经存在，请勿重复添加！';

    this.body = result;
    return;
  } else if (is_new == 0 && !doc) {
    result.code = '2';
    result.message = '该分类不存在，无法编辑！';

    this.body = result;
    return;
  }

  let res = await CateModel.edit(is_new);

  this.body = result;
}
exports.aj_cate_edit.__method__ = 'post';

exports.cate = async function() {
  await this.bindDefault();
  if (!userAuthor.checkAuth(this, this.userInfo)) {
    return };

  await this.render('dashboard/post_cate', {
    breads: ['文章管理', '分类管理'],
    userInfo: this.userInfo,
    siteInfo: this.siteInfo
  })
}
