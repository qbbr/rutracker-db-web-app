export default {
    template: `
        <div class="container">
            <h2>RuTracker Local Web Application</h2>
            <p>
                Web Application for Rsyslog on Symfony + Vue.js.
                <br>
                See on <a href="https://github.com/qbbr/rutracker-local" rel="external">GitHub</a>.
            </p>

            <h3>
                Info
                <div v-if="loading" class="spinner-border spinner-border-sm align-middle text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </h3>
            <p>
                Vue.js: {{ info.vue.ver }}<br>
                OS: {{ info.os }}<br>
                PHP: {{ info.php.ver }}<br>
                Symfony: {{ info.sf.ver }} ({{ info.sf.env }})<br>
                Database: {{ info.db.ver }} ({{ info.db.size }} Mb)<br><br>
                Torrent count: {{ info.count.torrent }}<br>
                Forum count: {{ info.count.forum }}
            </p>

            <hr>

            <span class="text-muted">
                Developed with &lt;3 by <a href="https://qbbr.cat" rel="external">@qbbr</a>.
            </span>
        </div>
    `,
    data() {
        return {
            loading: true,
            info: {
                vue: { ver: Vue.version },
                os: '...',
                php: { ver: '...' },
                sf: { ver: '...', env: '...' },
                db: {
                    ver: '...',
                    size: '...',
                },
                count: {
                    torrent: '...',
                    forum: '...'
                }
            }
        }
    },
    mounted() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            this.loading = true;
            this.$http.get('/info').then(response => {
                this.info = Object.assign(this.info, response.data);
                this.loading = false;
            });
        }
    }
}
