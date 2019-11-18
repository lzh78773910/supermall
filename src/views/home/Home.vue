<template>
  <div id="home">
  <nav-ber class="home-nav">
    <div slot="center">购物街</div>
  </nav-ber>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   class="tab-control" v-show="isTabFixed" ref="tabControl1"/>
    <scroll class="content" ref="scroll" @scroll="scroll"  @pullingUp="pullingUp"  :probeType="3" :pullUpLoad="true" >
            <HomeSwiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
            <RecommendView :recommends="recommends"/>
            <FeatureView></FeatureView>
            <tab-control   :titles="titles" @tabClick="tabClick" ref="tabControl2"></tab-control>
            <goods-list :goods="showGoods"></goods-list>
      </scroll>
      <back-top @click.native="backClick"   v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  //子组件
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  //公共组件
  import NavBer from "components/common/navber/NavBer";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BScroll from "components/content/backTop/BackTop";
  import BackTop from "components/content/backTop/BackTop";

  import {BACKTOP_DISTANCE} from "common/const";
  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {itemListenerMixin} from "common/mixin";

  export default {
    name: "Home",
    components:{
        BackTop,
       HomeSwiper,
       RecommendView,
       FeatureView,
       NavBer,
       TabControl,
        GoodsList,
        Scroll,
        BScroll
    },
    data(){
        return{
            banners:[],
            recommends:[],
            titles:['流行','新款','精选'],
            tpye:'pop',
            goods:{
                'pop':{page:0,list:[]},
                'new':{page:0,list:[]},
                'sell':{page:0,list:[]},
            },
            isShowBackTop:false,
            tabOFFsetTop:0,
            isTabFixed:false,
            savaY:0,
        }
    },
      mixins:[itemListenerMixin],
      computed:{
          showGoods(){
              return this.goods[this.tpye].list
          }
      },
      //进来
      activated(){
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0,this.savaY,0)
      },
      //离开
      deactivated(){
        this.savaY=this.$refs.scroll.scroll.y
          //取消全局的监听
        this.$bus.$off('itemImgLoad', this.itemImgListener)
      },
    created() {
        //请求多个数据
        this.getHomeMultidata()
        //请求商品数据
        this.getHomeGoods('pop')
        this.getHomeGoods('new')
        this.getHomeGoods('sell')

        //3.监听item图片加载完成

    },
      methods:{
          /**
           * 网络请求
           */
        getHomeMultidata(){
            getHomeMultidata().then(res=>{
                this.banners=res.data.banner.list;
                this.recommends=res.data.recommend.list;
            })
        },
          getHomeGoods(type){
            const page=this.goods[type].page+1;
              getHomeGoods(type,page).then(res=>{
              this.goods[type].list.push(...res.data.list)
              this.goods[type].page += 1
                  //初始化加载
              this.$refs.scroll.finishPullUp()
          })
        },
          /**
           * 事件监听
           */

          tabClick(index){
              if(index==0){
                  this.tpye='pop'
              }else if(index==1){
                  this.tpye='new'
              }else{
                  this.tpye='sell'
              }
              this.$refs.tabControl1.currentIndex = index;
              this.$refs.tabControl2.currentIndex = index;
          },
          backClick(){
              this.$refs.scroll.scrollTo(0,0,500)
          },
          scroll(position){
              this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE
              // 2.决定tabControl是否吸顶(position: fixed)
              this.isTabFixed = (-position.y) > this.tabOffsetTop

          },
          pullingUp(){
              this.getHomeGoods(this.tpye)
              this.$refs.scroll.refresh()
          },
          swiperImageLoad(){
              //2.获取tebControl
              //组件属性 $el 拿到是组件元素
              this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
          }
      },
      mounted() {
      }
  }
</script>

<style scoped>
    #home {
        /*padding-top: 44px;*/
        height: 100vh;
        position: relative;
    }

    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
        /*position: fixed;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: 0;*/
        /*z-index: 9;*/
    }

    .content {
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

    .tab-control {
        position: relative;
        z-index: 9;
    }

    /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
    /*}*/
</style>
