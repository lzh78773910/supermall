<template>
    <div id="detail">
        <detail-nav-ber class="detail-nav" @titleClick="titleClick"  ref="nav"></detail-nav-ber>
        <scroll
                class="content"
                ref="scroll"
                @scroll="contentScroll"
                :probe-type="3"
        >
            <detail-swiper :topImages="topImages"></detail-swiper>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info ref="params" :paramInfo="paramInfo"></detail-param-info>
            <detail-comment-info ref="comment" :comment-info="commentInfo"/>
            <goods-list ref="recommend" :goods="recommends"></goods-list>
        </scroll>
        <detail-bottom-bar :addToCart="addToCart"/>
        <back-top @click.native="backClick"   v-show="isShowBackTop"></back-top>


    </div>
</template>

<script>
    import DetailNavBer from "./childComps/DetailNavBer";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import DetailBottomBar from "./childComps/DetailBottomBar";

    import Scroll from "components/common/scroll/Scroll";
    import GoodsList from "components/content/goods/GoodsList";

    import {itemListenerMixin} from "common/mixin";
    import {debounce} from "common/utils";

    import {BACKTOP_DISTANCE} from "common/const";
    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
    import {backTopMixin} from "common/mixin";

    export default {
        name: "Detail",
        components:{
            DetailSwiper,
            DetailNavBer,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,
            Scroll,
        },
        data(){
          return {
              iid : null,
              topImages:[],
              goods:{},
              shop:{},
              detailInfo: {},
              paramInfo: {},
              commentInfo:{},
              recommends:[],
              themeTopYs:[],
              getthemeTopYs:null,
              currentIndex: 0,
              isShowBackTop:false
          }
        },
        mixins:[itemListenerMixin],
        created() {
            //1初始化保存iid
           this.iid= this.$route.params.iid
            //2根据iid请求数据
            getDetail(this.iid)
            //3推荐数据
            getRecommend()

        },
        mixins:[backTopMixin],
        methods:{
            //图片加载完成在计算高度
            imageLoad(){
                this.$refs.scroll.refresh()
                this.getthemeTopYs()
            },
            titleClick(index){
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
            },
            //监听滚动
            contentScroll(positon){
                let positonY=-positon.y
                let lenght=this.themeTopYs.length
                //hack做法  给最后加个最大值 减少判断
                for(let i=0 ;i<lenght;i++){
                    if(this.currentIndex !== i && (i<lenght-1 && positonY >= this.themeTopYs[i] && positonY < this.themeTopYs[i+1] )){
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex=this.currentIndex
                    }
                }
                this.isShowBackTop = (-positon.y) > BACKTOP_DISTANCE
                //普遍做法
                // for(let i=0 ;i<lenght;i++){
                //     if(this.currentIndex !== i && (i<lenght-1 && positonY >= this.themeTopYs[i] && positonY < this.themeTopYs[i+1] )|| (i===lenght-1 && positonY >= this.themeTopYs[i])){
                //         this.currentIndex = i;
                //         this.$refs.nav.currentIndex=this.currentIndex
                //     }
                // }
            },
            addToCart(){
                const product={}
                product.image=this.topImages[0]
                product.title=this.goods.title
                product.desc=this.goods.desc
                product.price=this.goods.realPrice
                product.iid=this.iid

            }
        },
        mounted() {
            /**
             * 网络请求
             */
            getDetail(this.iid).then(result => {

                const data = result.result
                //获取轮播图
                this.topImages = data.itemInfo.topImages
                //获取商品信息
                this.goods=new Goods(data.itemInfo,data.columns, data.shopInfo.services)
                //创建店铺信息的对象
                this.shop=new Shop(data.shopInfo)
                // 保存商品的详情数据
                this.detailInfo = data.detailInfo;
                // 获取参数的信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
                //评论信息
                if(data.rate.cRate !== 0){
                    this.commentInfo = data.rate.list[0];

                }
            })

            getRecommend().then(result => {
              this.recommends=result.data.list
            })

         this.getthemeTopYs=debounce(()=>{
             this.themeTopYs=[]
             this.themeTopYs.push(0);
             this.themeTopYs.push(this.$refs.params.$el.offsetTop);
             this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
             this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
             this.themeTopYs.push(Number.MAX_VALUE);

         })
        },
        destroyed() {
            this.$bus.$off('itemImageLoad', this.itemImgListener)
        }
    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
        position: relative;
    }

    .content{
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

    .detail-nav{
        z-index: 9;
        background-color: #fff;
    }
</style>