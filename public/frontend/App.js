export default {
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark bd-navbar sticky-top">
            <div class="container">
                <span class="navbar-brand">
                    <i class="bi bi-cloud-arrow-down" style="font-size: 1.5rem;"></i>
                </span>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link" :class="{ 'active': $route.name === 'Home' }">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/about" class="nav-link"  :class="{ 'active': $route.name === 'About' }">About</router-link>
                        </li>
                    </ul>

                     <ul class="navbar-nav mt-2 mt-lg-0 ms-md-auto justify-content-end">
                        <li class="nav-item dropdown">
                            <button class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme (dark)">
                                <span class="theme-icon-active"><i class="bi bi-circle-half"></i></span>
                                <span class="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
                            </button>

                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
                                <li>
                                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                                        <span class="theme-icon me-2"><i class="bi bi-sun-fill"></i></span>
                                        Light
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
                                        <span class="theme-icon me-2"><i class="bi bi-moon-stars-fill"></i></span>
                                        Dark
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
                                        <span class="theme-icon me-2"><i class="bi bi-circle-half"></i></span>
                                        Auto
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container my-5">
            <router-view></router-view>
        </div>
    `
}
