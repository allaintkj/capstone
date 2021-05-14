const initialState = {
    url: 'http://localhost:5050/api'
};

export default function(state = initialState, action) {
    switch (action.type) {
        default:
            return {
                ...state
            };
    }
}
