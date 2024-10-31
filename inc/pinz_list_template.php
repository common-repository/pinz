<script type="text/html" id="pinz_tmpl">

    <li class="control-section accordion-section pinz" name="<%=_name%>">
        <h3 class="accordion-section-title logo"> 
            <span class="pinz-name"> <%=_name%> </span>
            <span class="info" id="beforeOrAfter">[<%=_beforeOrAfter%>]</span>
        </h3>
        <ul class="accordion-section-content">
            <li>
                <label>
                    <span class="customize-control-title">Pinz Name</span>
                    <input type="text" value="<%=_name%>" name="pd-name" autocomplete="off" ref="<%=_name%>">
                </label>
            </li>
            <li class="customize-control customize-control-radio">
                <span class="customize-control-title">Place your content</span>
                <label>
                    <input type="radio" value="before" class="beforeOrAfter pd-before" name="beforeOrAfter_<%=_name%>" <% if (_beforeOrAfter == "before") { %> checked <% } %> ref="<%=_name%>">
                   Before<br>
                </label>
                <label>
                    <input type="radio" value="after" class="beforeOrAfter pd-after" name="beforeOrAfter_<%=_name%>"  <% if (_beforeOrAfter == "after") { %> checked <% } %> ref="<%=_name%>" >
                    After<br>
                </label>
            </li>
            <li style="display:none;">
                <label>
                    <span class="customize-control-title">Encapsulate by (html tag name)</span>
                    <input type="text" value="<%=_encapsulateBy%>" name="pd-encapsulate" autocomplete="off" ref="<%=_name%>" >
                </label>
            </li>
            <li>
                <ul class="sidebarmenudetails">
                    <li style="padding-top:20px; font-size:20px; color:#615e5e">
                        <strong>PINZ Inspector</strong>
                    </li>
                    <li>HTML Tag : <span id="pinz-tag" class="pinz-details"> <%=_tagName%> </span></li>
                    <li>ID : <span id="pinz-id" class="pinz-details">  <%=_id%> </span></li>
                    <li>Class : <span id="pinz-class" class="pinz-details"></span></li>
                    <li>Parent ID : <span id="pinz-parentID" class="pinz-details"> <%=_parentID%> </span></li>
                    <li style="display:none;">Distance : <span id="pinz-distance"> <%=_distance%> </span></li>
                    <li style="display:none;">Position : <span id="pinz-position"> <%=_position%> </span></li>
                </ul>
            </li>
            <li>
                <span class="button button-primary update-pinz" ref="<%=_name%>">Save</span>
                <span class="button button-secondary delete" ref="<%=_name%>">Delete</span>
                <span class="button button-secondary re-pinz" ref="<%=_name%>">Re-Pinz</span>
            </li>
        </ul>
    </li> 
</script>
 
