// Kullanıcının giriş yapıp yapmadığını kontrol eder
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

// Kullanıcı bilgilerini getirir
export const selectUser = (state) => state.auth.user;

// Refresh işleminin devam edip etmediğini kontrol eder
export const selectIsRefreshing = (state) => state.auth.isRefreshing;

// Auth işlemlerindeki hataları getirir
export const selectAuthError = (state) => state.auth.error;

// Kullanıcının token'ını getirir
export const selectToken = (state) => state.auth.token;
