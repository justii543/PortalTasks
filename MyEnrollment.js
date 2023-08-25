$(document).ready(function () {
    $("#hsin_coursetype").change(onDisplayChange);
    $("#hsin_islaptoprequired").change(function () { contentRetrieve(this) });
    $("#hsin_willbeavailableatoffice").change(function () { contentRetrieve(this) });
    $("#hsin_isaccomodationrequired").change(function () { contentRetrieve(this) });
    $("#hsin_iscabservicerequired").change(function () { contentRetrieve(this) });
    $("#hsin_islunchrequired").change(function () { contentRetrieve(this) });
    $("#hsin_aadhar").attr("maxlength", 12)
    $("#hsin_aadhar").hide();
    $("#hsin_aadhar_label").hide();
    var aadharLabel = document.getElementById("hsin_aadhar_label");
    aadharLabel.innerHTML += '<span style="color: red;"> *</span>';
    if (window.jQuery) {
        (function ($) {
            $(document).ready(function () {
                if (typeof Page_Validators == "undefined") return;
                // Create new validator
                var newValidator = document.createElement("span");
                newValidator.style.display = "none";
                newValidator.id = "Required_hsin_aadhar";
                newValidator.controltovalidate = "hsin_aadhar";
                newValidator.errormessage =
                    "<a href='#hsin_aadhar_label'>Aadhar is required</a>";
                newValidator.validationGroup = ""; // Set this if you have set ValidationGroup on the form
                newValidator.initialvalue = "";
                newValidator.evaluationfunction = function () {
                    var country = $("#hsin_nationality").val();
                    //debugger;
                    if (country == "c5418510-883a-ee11-bdf4-000d3af2e28f" && !$("#hsin_aadhar").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                // Add the new validator to the page validators array:
                Page_Validators.push(newValidator);
                // Wire-up the click event handler of the validation summary link
                $("a[href='#hsin_aadhar_label']").on("click", function () {
                    scrollToAndFocus("hsin_aadhar_label", "hsin_aadhar");
                });
            });
        })(window.jQuery);
    }

    $("#hsin_nationality").change(function () {
        var selectedValue = $(this).val();
        $(".checkbox").removeAttr("title");
        if (selectedValue == "c5418510-883a-ee11-bdf4-000d3af2e28f") {
            $("#hsin_aadhar").show();
            $("#hsin_aadhar_label").show();
            var test = $("#hsin_aadhar");
            console.log(test);
        }
        else {
            $("#hsin_aadhar").hide();
            $("#hsin_aadhar_label").hide();
            $("#hsin_aadhar").val("");
        }
    });
});

function onDisplayChange() {
    //debugger;
    var checkItem = $('#hsin_coursetype').find("option:selected").text();
    var sectionsToShow = [
        '#hsin_islaptoprequired',
        '#hsin_willbeavailableatoffice',
        '#hsin_islunchrequired',
        '#hsin_iscabservicerequired',
        '#hsin_isaccomodationrequired'
    ];
    var sectionsToHide = [
        ['#hsin_willbeavailableatoffice', '#hsin_islunchrequired', '#hsin_iscabservicerequired', '#hsin_isaccomodationrequired'],
        ['#hsin_willbeavailableatoffice', '#hsin_islunchrequired', '#hsin_iscabservicerequired'],
        ['#hsin_islaptoprequired', '#hsin_isaccomodationrequired']
    ];
    var index = -1;
    if (checkItem === "Online Course - Full Time") {
        index = 0;
    } else if (checkItem === "Online Course - Part Time") {
        index = 1;
    } else if (checkItem === "Offline Course - Full Time") {
        index = 2;
    }
    if (index >= 0) {
        sectionsToHide[index].forEach(function (section) {
            $(section).parent().parent().hide();
            $(section + "_label").hide();
        });
    }
    sectionsToShow.forEach(function (section) {
        if (index < 0 || !sectionsToHide[index].includes(section)) {
            $(section).parent().parent().show();
            $(section + "_label").show();
        }
    });
}

function contentRetrieve(context) {
    //debugger;
    const values = {
        courseType: $("#hsin_coursetype").val(),
        value: $(context).attr("id"),
        checked: $(context).prop("checked")
    }
    if (values.checked && !$(context).closest("span").attr("title")) {
        webapi.safeAjax({
            type: "GET",
            //url: "/_api/hsin_configs?$expand=hsin_ContentID($select=hsin_description)&$filter=(hsin_coursetype eq 486520002 and hsin_iscabservicerequired eq true and hsin_islaptoprequired eq false and hsin_isaccomodationrequired eq false and hsin_willbeavailableatoffice eq true and hsin_islunchrequired eq true)",
            url: "/_api/hsin_configs?$expand=hsin_ContentID($select=hsin_description)&$filter=(hsin_coursetype eq " + values.courseType + " and " + values.value + " eq " + values.checked + ")",
            contentType: "application/json",
            headers: {
                "Prefer": "odata.include-annotations=*"
            },
            success: function (data, textStatus, xhr) {
                var results = data;
                console.log(results);
                console.log(values.courseType);
                console.log(values.laptop);
                for (var i = 0; i < results.value.length; i++) {
                    var result = results.value[i];

                    // Many To One Relationships
                    if (result.hasOwnProperty("hsin_ContentID") && result["hsin_ContentID"] !== null) {
                        var hsin_ContentID_hsin_description = result["hsin_ContentID"]["hsin_description"]; // Multiline Text
                        console.log(hsin_ContentID_hsin_description);
                        $(context).closest("span").attr("title", hsin_ContentID_hsin_description);
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
            }

        });
    }
}

