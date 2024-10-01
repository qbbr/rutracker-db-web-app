import { bsTooltipHide, bsTooltipInit, calculatePages } from './helper.js';

const DEFAULT_PAGESIZE = 25;

export default {
    template: `
        <div class="container">
            <div class="d-lg-flex flex-lg-row">
                <div class="flex-fill text-center text-lg-start" :class="{ 'text-black-50': loading }">
                    Showing {{ page > 1 ? (page * pageSize) + 1 : 1 }} to {{ page > 1 ? (page + 1) * pageSize : page * pageSize }} of {{ total }} rows
                    <select class="form-select w-auto d-inline-block" :disabled="loading" v-model="pageSize" @change="changePageSize">
                        <option v-for="v in [25, 50, 100, 250, 500]" :value="v">{{ v }}</option>
                    </select>
                    per page
                </div>
                <nav v-if="lastPage > 1" class="flex-fill">
                    <ul class="pagination mb-0 justify-content-center justify-content-lg-end">
                        <li class="page-item" :class="{ 'disabled': page < 6 || loading }">
                            <router-link :to="{ query: getParams(1) }" class="page-link"><i class="bi bi-chevron-bar-left"></i></router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page === 1 || loading }">
                            <router-link :to="{ query: getParams(page - 1) }" class="page-link"><i class="bi bi-chevron-left"></i></router-link>
                        </li>
                        <li class="page-item" v-for="p in pages" :class="{ 'active': p === page, 'disabled': loading }">
                            <router-link :to="{ query: getParams(p) }" class="page-link">{{ p }}</router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page === lastPage || loading }">
                            <router-link :to="{ query: getParams(page + 1) }" class="page-link"><i class="bi bi-chevron-right"></i></router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page > lastPage - 6 || loading }">
                            <router-link :to="{ query: getParams(lastPage) }" class="page-link"><i class="bi bi-chevron-bar-right"></i></router-link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="!loading" class="table-responsive mt-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Size</th>
                            <th scope="col">Registered</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="row in rows">
                            <th scope="row">
                                {{ row.id }}
                            </th>
                            <td>
                                {{ row.title }}
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
        </div>
    `,
    data() {
        return {
            loading: true,
            total: 0,
            rows: [],
            pages: [],
            lastPage: 0,
            pageSize: DEFAULT_PAGESIZE,
            searchQuery: '',
        }
    },
    mounted() {
        if (this.$route.query.pageSize) {
            this.pageSize = Number(this.$route.query.pageSize);
        }

        if (this.$route.query.searchQuery) {
            this.searchQuery = this.$route.query.searchQuery;
        } else {
            this.getLatest();
        }

        this.$emitter.on('data:refresh', () => {
            this.getLatest();
        });

        window.addEventListener('keydown', this.hotkeyListener);
    },
    destroy() {
        window.removeEventListener('keydown', this.hotkeyListener);
    },
    computed: {
        page() {
            return Number(this.$route.query.page) || 1;
        }
    },
    watch: {
        page: 'getLatest',
        searchQuery: 'getLatest',
        pageSize: 'getLatest',
        '$route.query.searchQuery'(to, from) {
            this.searchQuery = to || '';
        },
        '$route.query.pageSize'(to, from) {
            this.pageSize = to || DEFAULT_PAGESIZE;
        }
    },
    methods: {
        getParams(page) {
            const params = {};
            if (page > 1) {
                params.page = page;
            }
            if (this.searchQuery.length) {
                params.searchQuery = this.searchQuery;
            }
            if (this.pageSize > 0 && this.pageSize !== DEFAULT_PAGESIZE) {
                params.pageSize = this.pageSize;
            }

            return params;
        },
        changePageSize() {
            this.$router.push({ query: this.getParams(this.page) });
        },
        getLatest() {
            bsTooltipHide();
            this.loading = true;

            this.$http.get('/torrent/latest', { params: this.getParams(this.page) }).then(response => {
                const data = response.data;

                this.rows = data.results;
                this.total = data.total;
                this.lastPage = data.lastPage;
                this.pages = calculatePages(this.page, this.lastPage);

                if (this.page > 0 && this.page > this.lastPage) {
                    this.$router.push({ query: this.getParams(this.lastPage) })
                }

                this.loading = false;
            }).then(() => {
                bsTooltipInit();
            });
        },
        hotkeyListener(event) {
            if ('INPUT' === document.activeElement.nodeName) { // skip if input is focused
                return;
            }
            if ('/' === event.key || 's' === event.key) { // focus search
                event.preventDefault();
                this.$emitter.emit('search:focus');
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
