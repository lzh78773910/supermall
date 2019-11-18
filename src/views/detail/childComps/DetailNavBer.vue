<template>
    <div class="nav">
        <nav-ber>
            <div slot="left" class="back" @click="backClick">
                <img src="~assets/img/common/back.svg">
            </div>
            <div slot="center" class="title">
                <div v-for="(item,index)  in titles"
                     class="title-item"
                     :class="{active:index===currentIndex}"
                     @click="titleClick(index)"
                >{{item}}</div>
            </div>
        </nav-ber>
    </div>
</template>

<script>

    import NavBer from "components/common/navber/NavBer";

    export default {
        name: "DetailNavBer",
        components: {
            NavBer
        },
        data(){
            return{
                titles:['商品','参数','评论','推荐'],
                currentIndex : 0
            }
        },
        methods:{
            titleClick(index){
                this.currentIndex=index
                this.$emit('titleClick',index)
            },
            backClick(){
                this.$router.back()
            }
        }
    }

</script>

<style scoped>
    .title{
        display: flex;
    }
    .title-item{
        flex: 1;
        font-size: 15px;
    }
    .active{
        color: var(--color-high-text);
    }
    .back img{
        margin-top: 10px;
    }
</style>