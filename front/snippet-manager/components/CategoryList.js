import CategoryCard from "./CategoryCard.js";

export default {
  data() {
    return {
      categories: [],
    };
  },
  components: {
    CategoryCard,
  },
  props: {
    activeCategoryId: Number | null,
  },
  mounted() {
    this.fetchCategories();

    this.onSelect(this.categories[0]);
  },
  emits: ["showCategory"],
  methods: {
    fetchCategories() {
      fetch("http://localhost:3010/v1/content/categories")
        .then((response) => response.json())
        .then((data) => {
          this.categories = data;
          console.log(data);
        });
    },
    onSelect(category) {
      this.$emit("showCategory", category);
    },
  },
  template: `
    <div class="h-screen overflow-scroll p-2">
      <div class="flex flex-col gap-2">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          :active="category.id === activeCategoryId"
          @click="onSelect(category)" />
      </div>
    </div>
  `,
};
