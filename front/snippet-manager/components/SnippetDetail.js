import LanguageSelector from "./LanguageSelector.js";
import CodeEditor from "./CodeEditor.js";

export default {
  data() {
    return {
      id: null,
      content: null,
      language: null,
      title: null,
    };
  },
  props: {
    snippet: {
      id: Number,
      title: String,
      content: String,
      language: String,
      date: String,
    },
  },
  watch: {
    snippet() {
      this.id = this.snippet?.id;
      this.content = this.snippet?.content;
      this.language = this.snippet?.language;
      this.title = this.snippet?.title;
    },
  },
  components: {
    CodeEditor,
    LanguageSelector,
  },
  methods: {
    updateSnippet() {
      console.log(`📡 API Call : Update Snippet ${this.id} with data`, {
        title: this.title,
        content: this.content,
        language: this.language,
      });
    },
  },
  template: `
    <div class="bg-gray-200 h-screen overflow-scroll p-2">
      <div v-if="snippet" class="flex flex-col h-full gap-4">
        <div class="flex flex-col gap-2">
          <input v-model="title" class="text-2xl border-0 outline-0 bg-transparent" />
          <LanguageSelector :language="snippet?.language" @update="(value) => language = value" />
        </div>

        <CodeEditor
          :content="content"
          :language="language"
          class="flex-grow"
          @update="(code) => this.content = code"
        />

        <button class="absolute z-10 bottom-10 right-10 bg-gray-100 hover:bg-gray-300 px-3 py-2 rounded-lg cursor-pointer" @click="updateSnippet">
          Save
        </button>
      </div>
    </div>
  `,
};
