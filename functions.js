/* INIT *******************************************************************/
var itemList = new Carbon("matkoll2_items");

var current_page = "#groceries";
var previous_page = "";
var scroll_positions = [];
var current_item={};
var current_items={};
var debug = new Timer();
var tags = [];

var items = itemList.get_all();


items.forEach(function(item) {
	if(item.parent_id == "-") item.parent_id = "";
 	if(moment(item.postpone, 'YYYY-MM-DD') < moment()) item.postpone =""; 
});

// Manuell sortering 
/*sortable.create(document.getElementById('open'), {handle: '.subitem-right',onSort: function (evt) {
	//alert("From " + evt.detail.startIndex + " to " + evt.detail.newIndex);    
	reorder(evt.oldIndex, evt.newIndex, "order");
}});

Sortable.create(document.getElementById('tasks'), {draggable: ".item",  handle: '.subitem-right',onSort: function (evt) {
	reorder(evt.oldIndex, evt.newIndex, "order_main");
}});
*/

open_page("#groceries");

//awesomlete edit
var input_parent = document.getElementById("parent");
var awesomplete = new Awesomplete(input_parent, {minChars: 0});
awesomplete.list = itemList.get_all().awesompleteList();
$('#parent').on('focus', function() {
	console.log("hej");  
	awesomplete.evaluate();
});
//awesomlete new
/*var input_parent2 = document.getElementById("parent2");
var awesomplete2 = new Awesomplete(input_parent2);
awesomplete2.list =itemList.get_all().awesompleteList();
*/

/* PageHandler *******************************************************/



function open_page (page_id, show_extra) {
	scroll_positions[current_page] = $("body").scrollTop();
	previous_page = current_page;
	current_page = page_id;
	
	//console.log(scroll_positions);
	
	if(page_id == "#issues") view_issue_list();
	else if(page_id == "#dishes") view_dishes();
	else if(page_id == "#groceries") view_groceries();
	else if(page_id == "#menu") view_settings(); 
	else if(page_id == "#single_dish") view_single_dish(current_item.id);
	console.log(page_id);
	
	$(".page").hide();
	$(page_id).show();

	if(page_id == "#groceries" || page_id == "#issues" )  $("body").scrollTop(scroll_positions[page_id]);
	else window.scrollTo(0, 0);
}


/* FUNCTIONS *******************************************************************/



function view_groceries(){ 	
	// deklarationer
	var query = $("#search").val().toLowerCase();
  	var items=itemList.get_all();
	
		// filtrera items	
		items =items
			.query("title, notes, parent_tree", "contains", query)
			.query("type", "==", "2"); 	//filtrera på varor
		
		var listed_items = items.query("status", "==", "listed"); 	//filtrera på varor
		var unlisted_items = items.query("status", "!=", "listed"); 	//filtrera på varor
	
		//sortera items
		//unlisted_items.sort(firstBy("update_date",-1).thenBy("prio").thenBy("postpone") .thenBy("order_main"));
	
	// output
	if (listed_items.length == 0 & unlisted_items.length == 0) $("#groceries .listed").append("<div class='empty'>No items here</div>");  	//om inga items hittas
	else {
			mustache_output("#groceries .listed", listed_items, "#listed_template"); //! !!!!!!
			mustache_output("#groceries .related", unlisted_items, "#related_template"); //! !!!!!!
	}
}



function view_dishes(){ 	
		// deklarationer
		var query = $("#dishes .search").val().toLowerCase();
		var items=itemList.get_all();
		
		// filtrera items
		items =items
			.query("notes", "!=", undefined) //ful-fix för att undvika crash vid filter nedan, (items som saknar notes)
			.query("title, notes, parent_tree", "contains", query)
			.query("type", "==", "1"); 	//filtrera på varor

		// sortera items
		items.sort(firstBy("prio").thenBy("title"));

		// output items
		if (items.length == 0) $("#groceries .listed").append("<div class='empty'>No items here</div>");  	//om inga items hittas
		else {
				mustache_output("#dishes .listed", items, "#dish_template"); //! !!!!!!
		}
}




function view_single_dish (id) {
		console.log(id);

		//titel för sida
		current_item = itemList.get_item(id);
		console.log(id);
		$("#single_dish .type-icon").html("<img src='img/type"+current_item.type+".png'>");    	
		$("#single_dish .menu-title").text(current_item.title);    
		var query = $("#single_dish .search").val().toLowerCase();
		//deklarera 
		var related_items =itemList.get_children(id);
		
		var items =itemList.get_all()
			.query("notes", "!=", undefined) //ful-fix för att undvika crash vid filter nedan, (items som saknar notes)
			.query("title, notes, parent_tree", "contains", query)
			.query("type", "==", "2"); 	//filtrera på varor
	
		var listed_items = related_items.query("status", "==", "listed");
		var unlisted_items = related_items.query("status", "!=", "listed");

		console.log(listed_items);
		console.log(unlisted_items);
		console.log(related_items);
	
		
		mustache_output("#single_dish .listed", listed_items, "#listed_template"); 
		mustache_output("#single_dish .related", unlisted_items, "#related_template"); 
  		//mustache_output("#single_dish .unrelated", items, "#unrelated_template");
   
    // om listan är tom
   if (listed_items.length==0 && unlisted_items.length == 0) $("#single_dish .listed").append("<div class='empty'>No items</div>");
		
	
}





function view_new (parameters) {
	scroll_positions[current_page] = $("body").scrollTop();
	previous_page = current_page;
	current_page = "#new";
	
	// sätta titel
	if(parameters.type == 1) type = "Dish";
	else if (parameters.type == 2) type = "Grocery";
	else if (parameters.type == 3) type = "Area";
	$("#new .menu-title").html("New "+type);
	
	fill_form("#new-item-form", parameters);		

	console.log("#new");
	
	$(".page").hide();
	$("#new").show();

	$("#new [name='title'] ").focus();
	
	window.scrollTo(0, 0);
}




function view_settings(){
    
    var field1 = $("#field1").val().toLowerCase();
    var op1 = $("#op1").val();
    var value1 = $("#value1").val();
    var field2 = $("#field2").val().toLowerCase();
    var op2 = $("#op2").val();
    var value2 = $("#value2").val();
    var items=itemList.get_all();
    	
    if(field1!="") items = items.query(field1, op1, value1);
    if(field2!="") items = items.query(field2, op2, value2);
    //console.log(items.length+" items");
    
    $("#export_count").html(items.length+" items<br/>");
    $("#export_count").append(items.query("finish_date", "==", "").length+" unfinished items<br/>");
    $("#export_count").append(items.query("finish_date", "!=", "").length+" finished items");
}





function reorder(from_pos, to_pos, field){
		console.log(from_pos);
console.log(to_pos);
console.log(field);
    var offset = 0;
    //debug.begin("reorder");
	
    for (var index = 0, len = current_items.length; index < len; index++) {
        
			item = current_items[index];
 			       
        if (from_pos >= to_pos){
            if(index == (to_pos)) offset++;
        }
        else{
            if (index == (to_pos+1)) offset++;
        }
        
        if(index == from_pos) offset--;
      
			itemList.set_item_field(item.id, field,  index + offset);
			item[field] = index + offset;


			if(index == from_pos) {
					itemList.set_item_field(item.id, field , to_pos);
					item[field] = to_pos;
				//console.log(item[field] );
			}
			console.log(item)
			
    }
    //console.log(items);
  
	current_items = current_items.sort(firstBy("order"));
   itemList.save(); 
	//debug.stop();
}



function mustache_output(output_id, items, template_id, group_by){
    //console.log(items);

    var html="";
 	  $(output_id).empty();
 	
    items.forEach(function(item) {
				var template = $(template_id).html();
				html += Mustache.to_html(template, item);
		});
	
		$(output_id).append(html);
}



function item_with_meta(id){
	var item = JSON.parse(JSON.stringify(itemList.get_item(id))); //kopia av item

	
	//har item ett projekt parent?
	item.subitems = itemList.get_children(item.id);	
	item.subitems = item.subitems.query("prio", "==", "1");
	item.subitems = item.subitems.query("finish_date", "==", "");
	var parents= itemList.get_parents(id).query("type","<","3");
	//console.log(itemList.get_parents(id));	
	if(parents.length > 0) item.has_parent = true;
	else item.has_parent = false;

	return item;
}





function fill_form(form_id, item){
	var elements = $(form_id).find(".autovalue");
	
	$(form_id + ' input:radio').prop('checked', false); 
    $(form_id + ' input:radio[value="'+item['icon']+'"]').prop('checked', true); // prio (css trick med bilder)
	$(form_id + ' input:radio[value="'+item['prio']+'"]').prop('checked', true); // prio (css trick med bilder)

	elements.each(function(test, element ) {
  		var name = element.getAttribute("name");
  			$(element).val(item[name]);
	});
}


