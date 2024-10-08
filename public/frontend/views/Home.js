export default {
    template: `
        <div class="container">
            <div class="row mb-3">
                <div class="col">
                    <forum-list></forum-list>
                </div>
                <div class="col position-relative">
                    <div class="row">
                        <div class="col">
                            <div class="input-group">
                                <input class="form-control" type="text" placeholder="Search" aria-label="Search" v-model="searchQuery" v-on:keyup.enter="search" ref="search" spellcheck="false">
                                <button type="button" class="btn btn-outline-danger border" v-if="searchQuery.length" @click="clearSearchQuery"><i class="bi bi-x-lg"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="row position-absolute bottom-0">
                        <div class="col">
                            <button type="button" class="btn btn-outline-primary" @click="search"><i class="bi bi-search"></i> Search</button>
                        </div>
                    </div>
                </div>
            </div>

            <torrent-paginated-table></torrent-paginated-table>
        </div>
    `,
    data() {
        return {
            searchQuery: '',
        }
    },
    mounted() {
        if (this.$route.query.searchQuery) {
            this.searchQuery = this.$route.query.searchQuery;
        }
    },
    methods: {
        search() {
            const params = {};

            if (this.searchQuery) {
                params.searchQuery = this.searchQuery;
            }

            if (this.$route.query.forumIds) {
                params.forumIds = this.$route.query.forumIds.toString();
            }

            this.$router.replace({ path: this.$route.path, query: params });
            setTimeout(() => {
                this.$emitter.emit('torrents:refresh');
            }, 0);
        },
        clearSearchQuery() {
            this.searchQuery = '';
            this.search();
        },
    }
};
