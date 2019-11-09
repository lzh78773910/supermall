<template>
  <div id="home">
  <nav-ber class="home-nav">
    <div slot="center">购物街</div>
  </nav-ber>
    <scroll class="content" ref="scroll" @scroll="scroll"  @pullingUp="pullingUp"  :probeType="3" :pullUpLoad="true" >
            <HomeSwiper :banners="banners"/>
            <RecommendView :recommends="recommends"/>
            <FeatureView></FeatureView>
            <TabControl class="tab-control"  :titles="titles" @tabClick="tabClick"></TabControl>
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
  import BScroll from "components/content/backTop/BackTop.vue";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import BackTop from "../../components/content/backTop/BackTop";

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
            isShowBackTop:false
        }
    },
      computed:{
          showGoods(){
              return this.goods[this.tpye].list
          }
      },
    created() {
        //请求多个数据
        this.getHomeMultidata()
        //请求商品数据
        this.getHomeGoods('pop')
        this.getHomeGoods('new')
        this.getHomeGoods('sell')
    },
      methods:{
        getHomeMultidata(){
            /**
             * 网络请求
             */
            getHomeMultidata().then(res=>{
                console.log(res)
                this.banners=res.data.banner.list;
                this.recommends=res.data.recommend.list;
            })
        },
          getHomeGoods(type){
            const page=this.goods[type].page+1;
              getHomeGoods(type,page).then(res=>{
              console.log(res)
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
              console.log(index);
              if(index==0){
                  this.tpye='pop'
              }else if(index==1){
                  this.tpye='new'
              }else{
                  this.tpye='sell'
              }
          },
          backClick(){
              this.$refs.scroll.scrollTo(0,0,500)
          },
          scroll(position){
              this.isShowBackTop = (-position.y)>1000
          },
          pullingUp(){
              this.getHomeGoods(this.tpye)
              //重新计算可滚动区域
              this.$refs.scroll.refresh()
          }
      }
  }
</script>

<style scoped>
    #home{
        padding-top: 44px;
        position: relative;
        height: 100vh;
    }

     .home-nav{
       background-color: var(--color-tint);
       color:#fff;
         position: fixed;
         left: 0;
         right: 0;
         top: 0;
         z-index: 9;
     }
    .tab-control{
        position: sticky;
        top: 44px;
        z-index: 9;
    }
    .content{
        overflow: hidden;
        position:absolute ;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
    /*.content{*/
    /*   height:calc(100% - 93px);*/
    /*    margin-top: 44px;*/
    /*}*/
</style>
