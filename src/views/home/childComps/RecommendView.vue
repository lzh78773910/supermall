<template>
    <div class="recommend">
        <div class="recommend-view"  v-for="item in recommends">
            <a :href="item.link">
                <img :src="item.image">
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RecommendView",
        props:{
            recommends:{
                type: Array,
                default(){
                    return []
                }
            }
        }
    }
</script>

<style scoped>
    .recommend {
        display: flex;
        text-align: center;
        font-size: 13px;
        padding: 10px 0 15px 0;
        border-bottom: 10px solid #eee;
    }
    .recommend-view{
        flex: 1;
    }
    .recommend-view img{
        width: 70px;
        height: 70px;
        margin-bottom: 10px;
    }
</style>