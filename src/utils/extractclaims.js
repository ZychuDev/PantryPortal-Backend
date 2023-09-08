function extractClaims()  {
    const token = localStorage.getItem('user-token');
    return JSON.parse(atob(token.split('.')[1]));
}

export default extractClaims