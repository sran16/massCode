import SnippetCard from "./SnippetCard.js";

export default {
  data() {
    return {
      snippets: [],
    };
  },
  components: {
    SnippetCard,
  },
  computed: {
    snippetsOfCategory() {
      return this.snippets.filter((s) => s.category_id === this.categoryId);
    },
  },
  props: {
    categoryId: Number,
    activeSnippetId: Number | null,
  },
  mounted() {
    this.fetchSnippets();
  },
  emits: ["showSnippet"],
  methods: {
    async fetchSnippets() {
      fetch("http://localhost:3010/v1/content/snippets")
        .then((response) => response.json())
        .then((data) => {
          this.snippets = data;
          console.log(data);
        });
    },
    onSelect(snippet) {
      fetch(`http://localhost:3010/v1/content/snippets/${id}`, {
        method: "PATCH",
      }).then(() => {
        this.fetchSnippets();
      });
      this.$emit("showSnippet", snippet);
    },
  },
  template: `
  {{snippets}}
    <div class="h-screen overflow-scroll p-2">
      <div class="flex flex-col gap-2">
        <SnippetCard
          v-for="(snippet, index) in snippetsOfCategory"
          :key="index"
          :snippet="snippet"
          :active="snippet.id === this.activeSnippetId"
          @click="onSelect(snippet)" />
      </div>
    </div>
  `,
};
