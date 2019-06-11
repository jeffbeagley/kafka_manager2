import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import connectors from "./views/connectors";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/connectors",
      name: "connectors",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "connectors" */ "./views/connectors.vue")
    }
  ]
});
