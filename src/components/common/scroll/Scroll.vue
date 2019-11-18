<template>
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        name: "scroll",
        props:{
            probeType:{
                tpye : Number,
                default:0
            },
            pullUpLoad:{
                tpye : Boolean,
                default: false
            }
        },
        data(){
            return{
                scroll:null
            }
        },
        mounted() {
            //创建bscroll对象
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: true,
                pullUpLoad: this.pullUpLoad
            })
            //监听滚动位置
            if (this.probeType === 2 || this.probeType === 3) {
            this.scroll.on('scroll', (position) => {
                this.$emit('scroll', position)
            })
        }
            //上拉加载更多
            if(this.pullUpLoad){
            this.scroll.on('pullingUp',()=>{
                this.$emit('pullingUp')
            })
        }
        },
        methods:{
            //回顶
            scrollTo(x,y,time=300){
                this.scroll && this.scroll.scrollTo(x,y,time)
            },
            //初始化下拉更大
            finishPullUp(){
                this.scroll  &&  this.scroll.finishPullUp()
            },
            //重新计算高
            refresh(){
                this.scroll &&   this.scroll.refresh()
            }
        }
    }
</script>

<style scoped>

</style>