document.getElementById('form-create-group').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        formData.append("isGroup", true);
        const response = await axios.post('/create-chat', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;
        if (data.success) {
            alert(data.message);
            localStorage.setItem('fetch', 'true');
            window.location.href = '/';
        }
        else
            alert("Already member");
    } catch (error) {
        alert("Internal server error");
        console.log(error);
    }
});