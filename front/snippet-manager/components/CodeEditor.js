export default {
  data() {
    return {
      flask: null,
    };
  },
  emits: ["update"],
  props: {
    content: String,
    language: String,
  },
  mounted() {
    this.init();
  },
  watch: {
    language() {
      this.init();
    },
  },
  methods: {
    init() {
      this.flask = new CodeFlask("#editor", {
        language: this.language,
      });

      this.flask.updateCode(this.content);

      this.flask.onUpdate((code) => {
        this.$emit("update", code);
      });
    },
  },
  template: `
    <div id="editor" class="relative h-full w-full flex flex-col" />
  `,
};
