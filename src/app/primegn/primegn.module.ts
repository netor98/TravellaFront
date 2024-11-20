import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {InputGroupAddon, InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ChipsModule} from "primeng/chips";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {ChipModule} from "primeng/chip";
import {MultiSelectModule} from "primeng/multiselect";
import {CardModule} from "primeng/card";
import {CarouselModule} from "primeng/carousel";
import {PasswordModule} from "primeng/password";
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {PanelMenuModule} from "primeng/panelmenu";
import {PanelModule} from "primeng/panel";
import {SliderModule} from "primeng/slider";
import {SplitButtonModule} from "primeng/splitbutton";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    DialogModule,
    ButtonModule,
    InputGroupModule,
    InputTextModule,
    InputGroupAddonModule,
    ChipsModule,
    OverlayPanelModule,
    DropdownModule,
    CalendarModule,
    ChipModule,
    MultiSelectModule,
    CardModule,
    CarouselModule,
    PasswordModule,
    DividerModule,
    InputSwitchModule,
    PanelModule,
    SliderModule,
    SplitButtonModule
  ]
})
export class PrimegnModule {
}
