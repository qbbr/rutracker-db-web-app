export default {
    template: `
        <div class="input-group">
            <input class="form-control" type="text" placeholder="Forum search" aria-label="Forum filter" v-model="searchQuery" v-on:keyup.enter="search" :disabled="isLoading" spellcheck="false">
            <button type="button" class="btn btn-outline-danger border" v-if="searchQuery.length" @click="clearSearchQuery"><i class="bi bi-x-lg"></i></button>
            <button type="button" class="btn btn-outline-light" @click="search"><i class="bi bi-search"></i></button>
        </div>
        <select class="form-select" size="10" multiple aria-label="Forum list" v-model="forumIds" :disabled="isLoading">
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
            searchQuery: '',
        }
    },
    mounted() {
        this.getForumList();

        if (this.$route.query.forumIds) {
            this.forumIds = this.$route.query.forumIds.split(',');
        }
    },
    watch: {
        forumIds: 'changeForumIds',
    },
    methods: {
        getParams() {
            const params = {};

            if (this.searchQuery) {
                params.searchQuery = this.searchQuery;
            }

            return params;
        },
        getForumList() {
            this.isLoading = true;

            this.$http.get('/forum/list', { params: this.getParams() }).then(response => {
                this.forumList = response.data;
                this.isLoading = false;
            });
        },
        search() {
            this.getForumList();
        },
        clearSearchQuery() {
            this.searchQuery = '';
            this.search();
        },
        changeForumIds() {
            const query = this.$route.query;
            this.$router.replace({ path: this.$route.path, query: { ...query, forumIds: this.forumIds.toString() }});
        },
    }
};
