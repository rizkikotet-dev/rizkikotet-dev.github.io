---
icon: fas fa-download
order: 4
---

# Downloads

{: .mb-5 }

<div class="card categories">
    <div class="card-header d-flex justify-content-between hide-border-bottom">
        <span class="ms-2">
            <i class="far fa-folder-open fa-fw"></i>
            <span class="mx-2">Available Downloads</span>
            <span class="text-muted small font-weight-light">All files</span>
        </span>
    </div>
    <div class="collapse show">
        <ul id="download-list" class="list-group">
            {% for file in site.static_files %}
                {% if file.path contains '/downloads/' %}
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <i class="far fa-file fa-fw"></i>
                            <a href="{{ file.path | relative_url }}" download class="mx-2">
                                {{ file.name }}
                            </a>
                        </span>
                        <a href="{{ file.path | relative_url }}" download class="text-primary">
                            <i class="fas fa-download"></i>
                        </a>
                    </li>
                {% endif %}
            {% endfor %}
        </ul>
    </div>
</div>