import { calculatePages } from '../helper.js';

const DEFAULT_PAGESIZE = 25;
const AVAILABLE_PAGESIZES = [25, 50, 100, 250, 500];

export default {
    template: `
        <div class="d-lg-flex flex-lg-row">
            <div class="flex-fill text-center text-lg-start" :class="{ 'text-black-50': isLoading }">
                Showing {{ page > 1 ? (page * pageSize) + 1 : 1 }} to {{ page > 1 ? (page + 1) * pageSize : page * pageSize }} of {{ total }} rows
                <select class="form-select w-auto d-inline-block" :disabled="isLoading" v-model="pageSize" @change="changePageSize">
                    <option v-for="v in pageSizes" :value="v">{{ v }}</option>
                </select>
                per page
            </div>
            <nav v-if="lastPage > 1" class="flex-fill">
                <ul class="pagination mb-0 justify-content-center justify-content-lg-end">
                    <li class="page-item" :class="{ 'disabled': page < 6 || isLoading }">
                        <router-link :to="{ query: getParams(1) }" class="page-link"><i class="bi bi-chevron-bar-left"></i></router-link>
                    </li>
                    <li class="page-item" :class="{ 'disabled': page === 1 || isLoading }">
                        <router-link :to="{ query: getParams(page - 1) }" class="page-link"><i class="bi bi-chevron-left"></i></router-link>
                    </li>
                    <li class="page-item" v-for="p in pages" :class="{ 'active': p === page, 'disabled': isLoading }">
                        <router-link :to="{ query: getParams(p) }" class="page-link">{{ p }}</router-link>
                    </li>
                    <li class="page-item" :class="{ 'disabled': page === lastPage || isLoading }">
                        <router-link :to="{ query: getParams(page + 1) }" class="page-link"><i class="bi bi-chevron-right"></i></router-link>
                    </li>
                    <li class="page-item" :class="{ 'disabled': page > lastPage - 6 || isLoading }">
                        <router-link :to="{ query: getParams(lastPage) }" class="page-link"><i class="bi bi-chevron-bar-right"></i></router-link>
                    </li>
                </ul>
            </nav>
        </div>

        <div v-if="!isLoading" class="table-responsive mt-3">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Size</th>
                        <th scope="col">Registered</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="row in rows">
                        <td scope="row">
                            <router-link :to="{ name: 'Torrent', params: { id: row.id } }">{{ row.title }}</router-link>
                        </td>
                        <td>
                            {{ row.size }}
                        </td>
                        <td>
                            {{ $filters.toLocaleString(row.registredAt) }}
                        </td>
                        <td>
                            <a :href="$filters.magnetUrl(row.hash, row.title)">
                                <i class="bi bi-magnet"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-center">
            <div class="spinner-border text-warning my-5" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `,
    data() {
        return {
            isLoading: true,
            total: 0,
            rows: [],
            pages: [],
            lastPage: 0,
            pageSize: DEFAULT_PAGESIZE,
            pageSizes: AVAILABLE_PAGESIZES,
            forumIds: '',
        }
    },
    mounted() {
        if (this.$route.query.pageSize) {
            this.pageSize = Number(this.$route.query.pageSize);
        }

        if (this.$route.query.forumIds) {
            this.forumIds = this.$route.query.forumIds;
        }

        this.$emitter.on('torrents:refresh', () => {
            this.getLatestTorrents();
        });

        this.getLatestTorrents();

        window.addEventListener('keydown', this.hotkeyListener);
    },
    unmounted() {
        window.removeEventListener('keydown', this.hotkeyListener);
    },
    computed: {
        page() {
            return Number(this.$route.query.page) || 1;
        },
    },
    watch: {
        page: 'getLatestTorrents',
        pageSize: 'getLatestTorrents',
    },
    methods: {
        getParams(page) {
            const params = {};

            if (page > 1) {
                params.page = page;
            }

            if (this.$route.query.searchQuery) {
                params.searchQuery = this.$route.query.searchQuery;
            }

            if (this.pageSize > 0 && this.pageSize !== DEFAULT_PAGESIZE) {
                params.pageSize = this.pageSize;
            }

            if (this.$route.query.forumIds) {
                params.forumIds = this.$route.query.forumIds;
            }

            return params;
        },
        changePageSize() {
            this.$router.push({ query: this.getParams(this.page) });
        },
        getLatestTorrents() {
            this.isLoading = true;

            this.$http.get('/torrent/latest', { params: this.getParams(this.page) }).then(response => {
                const data = response.data;

                this.rows = data.results;
                this.total = data.total;
                this.lastPage = data.lastPage;
                this.pages = calculatePages(this.page, this.lastPage);

                if (this.page > 0 && this.page > this.lastPage) {
                    this.$router.push({ query: this.getParams(this.lastPage) })
                }

                this.isLoading = false;
            });
        },
        hotkeyListener(event) {
            if ('INPUT' === document.activeElement.nodeName) { // skip if input is focused
                return;
            }
            if ('/' === event.key || 's' === event.key) { // focus search
                event.preventDefault();
                this.$refs.search.focus();
            } else if (event.ctrlKey) { // page navigation
                let page = null;
                if (event.key === 'ArrowLeft' && this.page > 1) { // prev
                    if (event.shiftKey) {
                        page = 1;
                    } else {
                        page = this.page - 1;
                    }
                } else if (event.key === 'ArrowRight' && this.page < this.lastPage) { // next
                    if (event.shiftKey) {
                        page = this.lastPage;
                    } else {
                        page = this.page + 1;
                    }
                }

                if (page) {
                    event.preventDefault();
                    this.$router.push({ query: this.getParams(page) });
                }
            }
        }
    }
};
