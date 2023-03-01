function createItem (element)
{
    let l = document.createElement("li");
    l.innerHTML = element;
    return l;
}

function createList (list, func = createItem)
{
    let ul = document.createElement("ul");

    list.forEach(element => 
    {
        let li = func(element);
        ul.appendChild(li);
    });

    return ul;
}

function assignResume (name, value)
{
    let e = document.getElementById(name);
    if (!value)
    {
        return;
    }

    e.innerHTML = `
        <h4>${texts[name]}</h4>
        <p>${value}</p>
    `;
}

function assignPersonal (name, value)
{
    let patterns = {
        "email":{
            icon:"icons/email.svg",
            prefix:"mailto:",
            link: true
        },
        "linkedin":{
            icon:"icons/linkedin.svg",
            link: true
        },
        "github":{
            icon:"icons/github-mark.png",
            link: true
        },
        "location":{
            icon:"icons/location.svg"
        }
    }

    let el = document.getElementById(name);
    el.innerHTML = "";
    //let list = document.createElement("ul");

    let infos = Object.entries(value);

    el.appendChild(createList(infos, ([n, v]) => 
    {
        let p = patterns[n];
        
        let l = document.createElement("li");
        let a = document.createElement("a");
        
        if(p.link)
        {
            a.href = `${p.prefix?p.prefix:""}${v}`;
        }

        a.innerHTML = `
            <img src="${p.icon}" />
            ${v}
        `;

        l.appendChild(a);
        return l;
    }));
}

function assignSkills (name, value)
{
    let values = Object.entries(value);
    var l 

    values.forEach(([n, v]) => 
    {
        let skill = document.getElementById(n);
        skill.innerHTML = `<h4>${texts[n]}</h4>`;

        let list = createList(v);
        skill.appendChild(list);
    });
}

function assignExperiences (name, value)
{
    let section = document.getElementById(name);
    if (!value || value.length == 0)
    {
        return;
    }

    section.innerHTML = `<h4>${texts[name]}</h4>`;

    section.appendChild(createList(value, (element) => 
    {
        let l = document.createElement("li");
        
        let values = Object.entries(element);
        let general = document.createElement("div");
        let period = document.createElement("div");
        let title = document.createElement("span");
        title.className = "title";

        general.appendChild(title);

        values.forEach(([n, v]) => 
        {
            let e = document.createElement("span");
            e.innerText = v;
            e.className = n;

            switch (n) 
            {
                case "period":
                    period.appendChild(e)
                    break;
                case "role":
                    title.appendChild(e)
                    break;
                case "company":
                    e.innerText = ` - ${e.innerText}`
                    title.appendChild(e)
                    break;
                default:
                    general.appendChild(e)
                    break;
            }
        });

        l.appendChild(general);
        l.appendChild(period);
        return l;
    }));
}

function assignEducations (name, value)
{
    let section = document.getElementById(name);
    if (!value || value.length == 0)
    {
        return;
    }
    section.innerHTML = `<h4>${texts[name]}</h4>`;

    section.appendChild(createList(value, (element) => 
    {
        let l = document.createElement("li");

        let values = Object.entries(element);
        let general = document.createElement("div");
        let status = document.createElement("div");
        let title = document.createElement("span");
        title.className = "title";

        general.appendChild(title);

        values.forEach(([n, v]) => 
        {
            let e = document.createElement("span");
            e.innerText = v;
            e.className = n;

            switch (n) 
            {
                case "status":
                    status.appendChild(e)
                    break;
                case "course":
                    title.appendChild(e)
                    break;
                case "institution":
                    e.innerText = ` - ${e.innerText}`
                    title.appendChild(e)
                    break;
                default:
                    general.appendChild(e)
                    break;
            }
        });
        
        l.appendChild(general);
        l.appendChild(status);
        return l;

    }));
}

function assignCommunity (name, value)
{
    let e = document.getElementById(name);
    e.innerHTML = `
        <h4>${texts[name]}</h4>
        <p>${value}</p>
    `;
}

function assignData (name, value)
{
    document.getElementById(name).innerText = value;
}

function checkInfo ([name, value])
{
    switch (name) {
        case "personal":
            assignPersonal(name, value);
            break;
        case "skills":
            assignSkills(name, value);
            break;
        case "experiences":
            assignExperiences(name, value);
            break;
        case "community":
            assignCommunity(name, value);
            break;
        case "educations":
            assignEducations(name, value);
            break;
        case "role":
            assignData(name, value.toUpperCase());
            break;
        case "resume":
            assignResume(name, value);
            break;
        default:
            assignData(name, value);
            break;
    }
}

function readData (data)
{
    let infos = Object.entries(data);
    infos.forEach(checkInfo);
}

let texts = null;

async function loadData (lang)
{
    texts = await fetch(`data/resume/${lang}.json`).then((res) => res.json());
    let data = await fetch(`data/personal/${lang}.json`).then((res) => res.json());
    readData(data);
}

function languageSelection ()
{
    let langselection = document.getElementById("language");

    let selectedLang = location.search.slice(1);
    if(selectedLang == "en" || selectedLang == "pt-br") 
    {
        langselection.value = selectedLang;
        loadData(selectedLang);
    }
    else loadData("pt-br");

    langselection.onchange = (e) => 
    {
        let lang = e.target.value;
        location.search = `${lang}`;
        loadData(lang);
    };
}

languageSelection ();