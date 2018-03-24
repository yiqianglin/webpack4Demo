
const netWorkErrorTo = () => import(/* webpackChunkName: "error" */ './view/error/error.vue')
  .then((resolve) => {
    console.log('重定向到error组件', resolve)
    return resolve
  })
  .catch((error) => {
    console.log(error)
  })

const error = () => import(/* webpackChunkName: "error" */ './view/error/error.vue')
  .then((resolve) => {
    return resolve
  })
  .catch((error, other) => {
    console.log('错误页面都找不着了，我能怎么办')
  })

const page1 = () => import(/* webpackChunkName: "page1" */ './view/page1/page1.vue')
  .then((resolve) => {
    return resolve
  })
  .catch((error, other) => {
    return netWorkErrorTo()
  })

const routes = [
  {
    path: '/',
    component: () => import('./view/index/index.vue'),
  },
  {
    path: '/page1',
    component: page1
  },
  {
    path: '/error',
    component: error
  },
];

export default routes;
