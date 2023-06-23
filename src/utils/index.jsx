
export const authHeader = () => {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return {
            'Authorization': 'Bearer ' + user.token,
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        }
    } else {
        return {};
    }
}

export const handleResponse = async (response, onError) => {
    const res = await response;
    const text = await res.text();

    const data = text && JSON.parse(text);
    if (!res.ok) {
        if (res.status === 401 && onError) {
            onError();
        }

        const error = (data && data.message) || res.statusText;
        throw new Error(error);
    }

    return data;
}

export const isEmail = (val) => {
    let regEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    return regEmail.test(val);
}

export const createProductSearchText = (product, producer, product_type) => {
    const { product_name, wine_color, wine_type, spirit_type, spirit_sub_type, beer_type, fortified_wine_type, vintage, bottle_size, article,
        country, region, sub_region, variaty, description, alc_vol, aroma, food, barrel_type, taste, residual_sugar, wine_acid,
        closure_type, allergy } = product;

    var result = producer.name;
    result += " ";
    result += product_type.label;
    result += " ";

    if (alc_vol) result += alc_vol + "%/vol ";
    if (allergy?.length > 0) allergy.map((data) => {
        return result += data.label + " ";
    });
    if (aroma?.length > 0) aroma.map((data) => {
        return result += data.label + " ";
    });
    if (article) result += article + " ";
    if (barrel_type) result += barrel_type + " ";
    if (beer_type) result += beer_type.label + " ";
    if (bottle_size) result += bottle_size.label + " ";
    if (closure_type) result += closure_type.label + " ";
    if (country) result += country.label + " ";
    if (description) result += description + " ";
    if (food?.length > 0) food.map((data) => {
        return result += data.label + " ";
    });
    if (fortified_wine_type) result += fortified_wine_type.label + " ";
    if (product_name) result += product_name + " ";
    if (region) result += region.label + " ";
    if (residual_sugar) result += residual_sugar + "g/l ";
    if (spirit_sub_type) result += spirit_sub_type.label + " ";
    if (spirit_type) result += spirit_type.label + " ";
    if (sub_region) result += sub_region.label + " ";
    if (taste) result += taste.label + " ";
    if (variaty?.length > 0) variaty.map((data) => {
        return result += data.grape.label + " ";
    });
    if (vintage) result += vintage.label + " ";
    if (wine_acid) result += wine_acid + "g/l ";
    if (wine_color) result += wine_color.label + " ";
    if (wine_type) result += wine_type.label + " ";

    return result;
}

export const createWineMenuSearchText = (menu) => {
    // const { menu_name, user_name, created_at } = menu;
    let result = "";
    for (let item in menu) {
        if (menu[item]) {
            result += menu[item] + " ";
        }
    }
    return result;
}

export const createCompanySearchText = (data) => {
    let result = "";
    for (let item in data) {
        if (item !== "country") {
            if (data[item]) {
                result += data[item] + " ";
            }
        } else {
            if (data[item]) {
                result += data[item].label + " ";
            }
        }
    }
    return result;
}

export const createUserSearchText = (data) => {
    let result = "";
    for (let item in data) {
        if (item === "country" || item === "company" || item === "user_role") {
            if (data[item]) {
                result += data[item].label + " ";
            }
        } else {
            if (data[item]) {
                result += data[item] + " ";
            }
        }
    }
    return result;
}