import { bsTooltipHide, bsTooltipInit, calculatePages } from './helper.js';

const DEFAULT_PAGESIZE = 25;

export default {
    template: `
        <div class="container">
            <div class="row mb-3">
                <div class="col">
                    <input class="form-control" type="text" placeholder="Forum filter" aria-label="Forum filter" v-model="forumFilter" :disabled="isForumLoading" spellcheck="false">
                    <select class="form-select" size="10" multiple aria-label="Forum list" v-model="forumIds" :disabled="isForumLoading" ref="forumSelect">
                        <template v-if="isForumLoading">
                            <option>Loading...</option>
                        </template>
                        <template v-else>
                            <option v-for="forum in forumList" :value="forum.id">{{ forum.name }}</option>
                        </template>
                    </select>
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

            <div class="d-lg-flex flex-lg-row">
                <div class="flex-fill text-center text-lg-start" :class="{ 'text-black-50': isTorrentsLoading }">
                    Showing {{ page > 1 ? (page * pageSize) + 1 : 1 }} to {{ page > 1 ? (page + 1) * pageSize : page * pageSize }} of {{ total }} rows
                    <select class="form-select w-auto d-inline-block" :disabled="isTorrentsLoading" v-model="pageSize" @change="changePageSize">
                        <option v-for="v in [25, 50, 100, 250, 500]" :value="v">{{ v }}</option>
                    </select>
                    per page
                </div>
                <nav v-if="lastPage > 1" class="flex-fill">
                    <ul class="pagination mb-0 justify-content-center justify-content-lg-end">
                        <li class="page-item" :class="{ 'disabled': page < 6 || isTorrentsLoading }">
                            <router-link :to="{ query: getParams(1) }" class="page-link"><i class="bi bi-chevron-bar-left"></i></router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page === 1 || isTorrentsLoading }">
                            <router-link :to="{ query: getParams(page - 1) }" class="page-link"><i class="bi bi-chevron-left"></i></router-link>
                        </li>
                        <li class="page-item" v-for="p in pages" :class="{ 'active': p === page, 'disabled': isTorrentsLoading }">
                            <router-link :to="{ query: getParams(p) }" class="page-link">{{ p }}</router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page === lastPage || isTorrentsLoading }">
                            <router-link :to="{ query: getParams(page + 1) }" class="page-link"><i class="bi bi-chevron-right"></i></router-link>
                        </li>
                        <li class="page-item" :class="{ 'disabled': page > lastPage - 6 || isTorrentsLoading }">
                            <router-link :to="{ query: getParams(lastPage) }" class="page-link"><i class="bi bi-chevron-bar-right"></i></router-link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="!isTorrentsLoading" class="table-responsive mt-3">
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
            isTorrentsLoading: true,
            isForumLoading: true,
            forumList: [],
            total: 0,
            rows: [],
            pages: [],
            lastPage: 0,
            pageSize: DEFAULT_PAGESIZE,
            searchQuery: '',
            forumIds: [],
            forumFilter: '',
        }
    },
    mounted() {
        this.getForumList();

        if (this.$route.query.pageSize) {
            this.pageSize = Number(this.$route.query.pageSize);
        }

        if (this.$route.query.searchQuery) {
            this.searchQuery = this.$route.query.searchQuery;
        }

        if (this.$route.query.forumIds) {
            this.forumIds = this.$route.query.forumIds.split(',');
        }

        this.getLatestTorrents();

        window.addEventListener('keydown', this.hotkeyListener);
    },
    unmounted() {
        window.removeEventListener('keydown', this.hotkeyListener);
    },
    computed: {
        page() {
            return Number(this.$route.query.page) || 1;
        }
    },
    watch: {
        page: 'getLatestTorrents',
        // searchQuery: 'getLatestTorrents',
        pageSize: 'getLatestTorrents',
        forumFilter: 'filterForum'
    },
    methods: {
        search() {
            const params = {};
            if (this.searchQuery.length) {
                params.searchQuery = this.searchQuery;
            }
            if (this.forumIds.length) {
                params.forumIds = this.forumIds.toString();
            }
            this.$router.push({ name: 'Home', query: params });
            this.getLatestTorrents();
        },
        clearSearchQuery() {
            this.searchQuery = '';
            this.search();
        },
        filterForum() {
            for (const option of this.$refs.forumSelect.children) {
                if (option.innerText.toLowerCase().includes(this.forumFilter.toLowerCase())) {
                    option.removeAttribute('hidden');
                } else {
                    option.setAttribute('hidden', true);
                }
            }
        },
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
            if (this.forumIds.length) {
                params.forumIds = this.forumIds.toString();
            }

            return params;
        },
        changePageSize() {
            this.$router.push({ query: this.getParams(this.page) });
        },
        getForumList() {
            this.$http.get('/forum/list').then(response => {
                this.forumList = response.data;
                this.isForumLoading = false;
            });
        },
        getLatestTorrents() {
            bsTooltipHide();
            this.isTorrentsLoading = true;

            this.$http.get('/torrent/latest', { params: this.getParams(this.page) }).then(response => {
                const data = response.data;

                this.rows = data.results;
                this.total = data.total;
                this.lastPage = data.lastPage;
                this.pages = calculatePages(this.page, this.lastPage);

                if (this.page > 0 && this.page > this.lastPage) {
                    this.$router.push({ query: this.getParams(this.lastPage) })
                }

                this.isTorrentsLoading = false;
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
