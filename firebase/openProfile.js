export function openProfile(uid) {

    if (!uid) return;

    window.location.href =
        `user.html?uid=${encodeURIComponent(uid)}`;

}
