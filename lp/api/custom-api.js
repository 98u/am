(function () {
    function appendInputToForm(form, name, value) {
        var children = form.children;
        if (typeof value === "object") value = JSON.stringify(value);
        for (var item = 0; item < children.length; item++) {
            if (children[item].getAttribute("name") === name) {
                children[item].value = value;
                return false;
            }
        }
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
        return true;
    }

    function appendInputToAllForms(name, value) {
        var forms = document.getElementsByTagName("form");
        for (var form = 0; form < forms.length; form++) {
            appendInputToForm(forms[form], name, value);
        }
    }

    function findGetParameter(item) {
        var result = "", items = [];
        var query = location.search.substr(1).split("&");
        for (var i = 0; i < query.length; i++) {
            items = query[i].split("=");
            if (items[0] === item) result = decodeURIComponent(items[1]);
        }
        return result;
    }

    function appendClick() {
        if (!!sessionStorage.getItem('kma-click')) {
            return appendInputToAllForms("click", sessionStorage.getItem('kma-click'));
        }
        var data1 = findGetParameter("d1") || findGetParameter("data1") || findGetParameter("utm_source");
        var data2 = findGetParameter("d2") || findGetParameter("data2") || findGetParameter("utm_medium");
        var data3 = findGetParameter("d3") || findGetParameter("data3") || findGetParameter("utm_campaign");
        var data4 = findGetParameter("d4") || findGetParameter("data4") || findGetParameter("utm_content");
        var data5 = findGetParameter("d5") || findGetParameter("data5") || findGetParameter("utm_term");
        var fbp = findGetParameter("fbp");
        var query = "data1=" + data1 + "&data2=" + data2 + "&data3=" + data3 + "&data4=" + data4 + "&data5=" + data5 + "&fbp=" + fbp;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "api/success.php?" + query, true);
        xhr.setRequestHeader('X-Kma-Api', 'click');
        if (!!document.referrer) xhr.setRequestHeader('X-Referer', document.referrer);
        xhr.send();
        xhr.onload = function () {
            var array;
            try {
                array = JSON.parse(this.response);
            } catch (e) {
                return;
            }
            console.log(array.click);
            if (array.click === undefined) return;
            sessionStorage.setItem('kma-click', array.click);
            appendInputToAllForms("click", array.click);
        };
    }

    appendClick();

    function prepareData(){
        var excludesFields = ["address", "client_data", "name", "phone"];
        var data = JSON.stringify($(this).serializeArray().filter(function(input){return -1 === excludesFields.indexOf(input.name)}));
        appendInputToForm(this, 'address', data);
    }

    document.querySelectorAll("form").forEach(function (item) {
        item.addEventListener("submit", prepareData, true);
    })
}());