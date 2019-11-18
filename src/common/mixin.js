import {debounce} from "common/utils";
import BackTop from "components/content/backTop/BackTop";


export const itemListenerMixin={
  data(){
    itemImgListener:null
  },
  mounted() {
    const refresh=debounce(this.$refs.scroll.refresh(),200)
    this.itemImgListener= ()=>{
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin={
  data(){
    isShowBackTop:false
  },
  components:{
    BackTop
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    }
  }
}