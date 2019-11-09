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
            this.scroll=new BScroll(this.$refs.wrapper, {
                probeType:this.probeType,
                click: true,
                pullUpLoad: this.pullUpLoad
            }),
            //监听滚动位置
            this.scroll.on('scroll',(position)=>{
                this.$emit('scroll',position)
            }),
            //上拉加载更多
            this.scroll.on('pullingUp',()=>{
                this.$emit('pullingUp')
            })
        },
        methods:{
            scrollTo(x,y,time=300){
                this.scroll.scrollTo(x,y,time)
            },
            finishPullUp(){
                this.scroll.finishPullUp()
            },
            refresh(){
                this.scroll.refresh()
            }
        }
    }
</script>

<style scoped>

</style>