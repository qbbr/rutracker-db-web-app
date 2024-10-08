export default {
    template: `
        <div class="container">
            <template v-if="isLoading">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <h3>{{ torrent.title }}</h3>

                <div>
                    <a :href="$filters.magnetUrl(torrent.hash, torrent.title)"><i class="bi bi-magnet"></i> Magnet URI</a>
                    <span class="mx-3">(size: {{ torrent.size }})</span>
                    <i class="bi bi-calendar3"></i> {{ torrent.registredAt }}
                </div>

                <p class="mt-3">{{ torrent.content }}</p>
            </template>
        </div>
    `,
    data() {
        return {
            isLoading: true,
            torrent: {},
        }
    },
    mounted() {
        this.getTorrent();
    },
    methods: {
        getTorrent() {
            this.isLoading = true;
            const id = this.$route.params.id;

            this.$http.get('/torrent/' + id).then(response => {
                this.torrent = response.data;
                this.isLoading = false;
            });
        },
    }
};
