import CategoryList from "./CategoryList.js";
import SnippetList from "./SnippetList.js";
import SnippetDetail from "./SnippetDetail.js";

export default {
  components: {
    CategoryList,
    SnippetList,
    SnippetDetail,
  },
  data() {
    return {
      category: null,
      snippet: null,
    };
  },
  template: `
  <div class="grid grid-cols-12">
    <div class="col-span-2">
      <CategoryList
        :active-category-id="category?.id"
        @show-category="(_category) => category = _category"
      />
    </div>

    <div class="col-span-3">
      <SnippetList
        :category-id="category?.id"
        :active-snippet-id="snippet?.id"
        @show-snippet="(_snippet) => snippet = _snippet"
      />
    </div>

    <div class="col-span-7">
      <SnippetDetail :snippet="snippet" />
    </div>
  </div>
 `,
};
