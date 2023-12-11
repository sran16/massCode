export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  props: {
    snippet: {
      title: String,
      language: String,
      date: String,
    },
    active: Boolean,
  },
  template: `
    <div
      class="bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2 flex flex-col gap-4"
      :class="{ 'bg-gray-200': this.active }"
    >
      <div>{{ snippet.title }}</div>

      <div class="flex justify-between text-gray-500">
        <div class="">{{ snippet.language }}</div>

        <div>{{ new Date(snippet.date).toLocaleDateString() }}</div>
      </div>

    </div>
  `,
};
