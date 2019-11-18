<template>
    <swiper class="detail-swiper" >
        <SwiperItem v-for="item in topImages">
                <img :src="item">
        </SwiperItem>
    </swiper>
</template>

<script>
    import {Swiper,SwiperItem} from "components/common/swiper";

    export default {
        name: "DetailSwiper",
        props:{
            topImages:{
                type: Array,
                default(){
                    return []
                }
            }
        },
        components : {
            Swiper,
            SwiperItem
        },
        created() {
        }

    }

</script>

<style scoped>
.detail-swiper{
    height: 300px;
}
</style>