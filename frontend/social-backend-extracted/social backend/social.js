document.addEventListener('DOMContentLoaded', () => {
    
    // Follow functionality
    const followBtn = document.getElementById('follow-btn');
    const followersCountSpan = document.getElementById('followers-count');
    let isFollowing = false;
    
    // Starting follower count (mocked as 1400 for 1.4k)
    let followersCount = 1400;

    followBtn.addEventListener('click', () => {
        isFollowing = !isFollowing;
        
        if (isFollowing) {
            followBtn.textContent = 'Following ✓';
            followBtn.classList.add('following');
            followersCount++;
            showToast('You are now following Cyber_Musician!', 'success');
        } else {
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('following');
            followersCount--;
            showToast('Unfollowed Cyber_Musician.', 'info');
        }
        
        // Update display logic (simplistic format)
        if (followersCount >= 1000) {
            followersCountSpan.textContent = (followersCount / 1000).toFixed(1) + 'k';
        } else {
            followersCountSpan.textContent = followersCount;
        }
    });

    // Modal & Share Playlist functionality
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    const closeModal = document.getElementById('close-modal');
    
    const playlistUrl = "https://aimusic.app/playlist/neon-dreams-2026";
    const shareText = "Check out this cyber aesthetic playlist!";

    shareBtn.addEventListener('click', () => {
        shareModal.classList.add('show');
    });

    closeModal.addEventListener('click', () => {
        shareModal.classList.remove('show');
    });

    // Close modal when clicking outside content
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('show');
        }
    });

    // Share Options
    document.getElementById('share-wa').addEventListener('click', () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + playlistUrl)}`, '_blank');
        shareModal.classList.remove('show');
    });

    document.getElementById('share-gmail').addEventListener('click', () => {
        window.open(`mailto:?subject=${encodeURIComponent("Listen to Neon Dreams 2026")}&body=${encodeURIComponent(shareText + '\n\n' + playlistUrl)}`, '_self');
        shareModal.classList.remove('show');
    });

    document.getElementById('share-tw').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(playlistUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        shareModal.classList.remove('show');
    });

    document.getElementById('share-copy').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(playlistUrl);
            showToast('Playlist link copied to clipboard!', 'success');
        } catch (err) {
            showToast('Playlist link ready to share!', 'success');
        }
        shareModal.classList.remove('show');
    });

    // Play functionality (just a mock for visual completeness)
    const playBtn = document.getElementById('play-btn');
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if(isPlaying) {
            playBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg> Pause`;
            showToast('Playing Neon Dreams 2026...', 'info');
        } else {
            playBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg> Play`;
        }
    });

    // Toast Notification System
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Add icon based on type
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            toast.style.borderLeftColor = 'var(--success-color)';
        } else {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            toast.style.borderLeftColor = 'var(--secondary-color)';
        }

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            // Wait for reverse animation
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400); // 400ms matches CSS transition
        }, 3000);
    }

    // Notification System Logic
    const bellBtn = document.getElementById('bell-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');
    
    let unreadCount = 0;

    bellBtn.addEventListener('click', () => {
        notifDropdown.classList.toggle('show');
        if (notifDropdown.classList.contains('show')) {
            // mark as read when opened
            unreadCount = 0;
            notifBadge.textContent = '0';
            notifBadge.style.display = 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-wrapper')) {
            notifDropdown.classList.remove('show');
        }
    });

    // Simulate receiving a incoming notification after 3 seconds
    setTimeout(() => {
        receiveNotification('Neon_Rider', 'started following you', 'assets/avatar.png'); // re-using avatar for demo
    }, 3000);

    function receiveNotification(user, action, avatarUrl) {
        unreadCount++;
        notifBadge.textContent = unreadCount;
        notifBadge.style.display = 'block';

        // Remove empty state if present
        const emptyState = notifList.querySelector('.notif-empty');
        if (emptyState) {
            emptyState.remove();
        }

        // Prepend new notification
        const notifHtml = `
            <div class="notif-item unread">
                <img src="${avatarUrl}" alt="${user}" class="notif-avatar">
                <div class="notif-text">
                    <strong>${user}</strong> ${action}
                    <div class="time">Just now</div>
                </div>
            </div>
        `;
        notifList.insertAdjacentHTML('afterbegin', notifHtml);
        
        // Also show a toast so the user definitely sees it
        showToast(`${user} ${action}`, 'success');
    }
});
