export default {
    template: `
        <input class="form-control" type="text" placeholder="Forum filter" aria-label="Forum filter" v-model="search" :disabled="isLoading" spellcheck="false">
        <select class="form-select" size="10" multiple aria-label="Forum list" v-model="forumIds" :disabled="isLoading" ref="forumSelect">
            <template v-if="isLoading">
                <option>Loading...</option>
            </template>
            <template v-else>
                <option v-for="forum in forumList" :value="forum.id">{{ forum.name }}</option>
            </template>
        </select>
    `,
    data() {
        return {
            isLoading: true,
            forumList: [],
            forumIds: [],
            search: '',
        }
    },
    mounted() {
        this.getForumList();

        if (this.$route.query.forumIds) {
            this.forumIds = this.$route.query.forumIds.split(',');
        }
    },
    watch: {
        search: 'changeSearch',
        forumIds: 'changeForumIds',
    },
    methods: {
        getForumList() {
            this.isLoading = true;

            this.$http.get('/forum/list').then(response => {
                this.forumList = response.data;
                this.isLoading = false;
            });
        },
        changeSearch() {
            for (const option of this.$refs.forumSelect.children) {
                if (option.innerText.toLowerCase().includes(this.search.toLowerCase())) {
                    option.removeAttribute('hidden');
                } else {
                    option.setAttribute('hidden', true);
                }
            }
        },
        changeForumIds() {
            const query = this.$route.query;
            this.$router.replace({ path: this.$route.path, query: { ...query, forumIds: this.forumIds.toString() }});
        },
    }
};
