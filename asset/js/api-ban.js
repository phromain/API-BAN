
const adresse1 = document.getElementById('adresse1');
const adresse2 = document.getElementById('adresse2');
const cp = document.getElementById('cp');
const ville = document.getElementById('ville');

function saisieAutoAdresse(idAdresse, idAdresse2, idville, idCP) {
    $(idAdresse).autocomplete({
        minLength: 4,
        source: function (request, response) {
            let query = request.term;
            if ($(idCP).val() !== "") {
                query += " " + $(idCP).val();
            }
            if ($(idville).val() !== "") {
                query += " " + $(idville).val();
            }
            $.ajax({
                url: "https://api-adresse.data.gouv.fr/search/?q=" + query + '&limit=15',
                dataType: "json",
                success: function (data) {
                    response($.map(data.features, function (item) {
                        let address = {
                            label: item.properties.name + " - " + item.properties.postcode + " - " + item.properties.city,
                            value: item.properties.name,
                            city: item.properties.city,
                            postcode: item.properties.postcode,
                            adresse2: item.properties.adresse2 || ""
                        };
                        if (item.properties.name.length > 32) {
                            let position = item.properties.name.lastIndexOf(' ', 31);
                            address.value = item.properties.name.substr(0, position);
                            address.adresse2 = item.properties.name.substr(position);
                        }
                        return address;
                    }));
                }
            });
        },
        select: function (event, ui) {
            $(idville).val(ui.item.city);
            $(idCP).val(ui.item.postcode);
            $(idAdresse2).val(ui.item.adresse2 || "");
        }
    });
}

function saisieAutoCP(idCP, idCommune) {
    $(idCP).autocomplete({
        minLength: 3,
        source: function (request, response) {
            let query = request.term;
            $.ajax({
                url: "https://api-adresse.data.gouv.fr/search/?q=" + query + "&limit=10",
                dataType: "json",
                success: function (data) {
                    let seen = {};
                    response($.map(data.features, function (item) {
                        if (!seen[item.properties.postcode + item.properties.city]) {
                            seen[item.properties.postcode + item.properties.city] = true;
                            return {
                                label: item.properties.postcode + " - " + item.properties.city,
                                value: item.properties.postcode,
                                city: item.properties.city
                            };
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            $(idCommune).val(ui.item.city);
        }
    });
}

function saisieAutoCommune(idCommune, idCP) {
    $(idCommune).autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "https://api-adresse.data.gouv.fr/search/?city=" + $().val() + "&limit=10",
                data: { q: request.term },
                dataType: "json",
                success: function (data) {
                    var cities = [];
                    response($.map(data.features, function (item) {
                        if ($.inArray(item.properties.postcode, cities) == -1) {
                            cities.push(item.properties.postcode);
                            return {
                                label: item.properties.city + " - " + item.properties.postcode,
                                postcode: item.properties.postcode,
                                citycode: item.properties.citycode,
                                value: item.properties.city
                            };
                        }
                    }));
                }
            });
        },
        select: function (event, ui) {
            $(idCP).val(ui.item.postcode);
        }
    });
}
